import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { catchError, share } from "rxjs/operators";
import { HttpParamsLiteral } from "src/models/http-params";
import { IssueSearchResult } from "src/models/issue-search-result.model";
import { RepoSearchResult, RepoSearchResultItem } from "src/models/repo-search-result.model";
import { IssueSearchConfig, RepoSearchConfig } from "src/models/search-configs";
import { isNotNullEmptyZero as isNotNullEmpty } from "src/utils/utils";

import { ToastService } from "./toast.service";

@Injectable({ providedIn: "root" })
export class GitSearchService {
  private readonly _apiRoot = "https://api.github.com";

  constructor(private readonly http: HttpClient, private readonly toastService: ToastService) {}

  getRepo(repoFullName: string) {
    const api = `${this._apiRoot}/repos/${repoFullName}`;
    return this.getWithErrorHandling<RepoSearchResultItem>(api);
  }

  getRepoResults(config: RepoSearchConfig) {
    const api = `${this._apiRoot}/search/repositories`;
    const { name, ...additionalParams } = config;

    if (!isNotNullEmpty(name)) {
      return of(null);
    }

    const params: HttpParamsLiteral = { q: `${name}+in:name` };
    if (isNotNullEmpty(additionalParams.order)) {
      params.order = additionalParams.order;
    }
    if (isNotNullEmpty(additionalParams.sort)) {
      params.sort = additionalParams.sort;
    }
    if (isNotNullEmpty(additionalParams.pageIndex)) {
      params.page = String(additionalParams.pageIndex + 1);
    }
    if (isNotNullEmpty(additionalParams.pageSize)) {
      params.per_page = String(additionalParams.pageSize);
    }
    return this.getWithErrorHandling<RepoSearchResult>(api, { params });
  }

  getIssuesResults(repoFullname: string, { pageIndex, pageSize, sort, order }: IssueSearchConfig) {
    const api = `${this._apiRoot}/search/issues`;
    const params: HttpParamsLiteral = { q: `repo:${repoFullname}`, page: String(pageIndex), per_page: String(pageSize), sort, order };
    return this.getWithErrorHandling<IssueSearchResult>(api, { params });
  }

  private getWithErrorHandling<T>(url: string, options?: { params?: HttpParamsLiteral }): Observable<T | null> {
    return this.http.get<T>(url, options).pipe(
      catchError((error: HttpErrorResponse) => (this.toastService.error(`An error occured: ${error.statusText}`), of(null))),
      share()
    );
  }
}
