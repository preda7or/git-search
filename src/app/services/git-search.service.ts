import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { catchError, share } from "rxjs/operators";
import { HttpParamsLiteral } from "src/models/http-params";
import { IssueSearchResult } from "src/models/issue-search-result.model";
import { OrderParamOptions, SortParamOptions } from "src/models/repo-search-params";
import { RepoSearchResult, RepoSearchResultItem } from "src/models/repo-search-result.model";

import { ToastService } from "./toast.service";

@Injectable({ providedIn: "root" })
export class GitSearchService {
  private readonly _apiRoot = "https://api.github.com";

  constructor(private readonly http: HttpClient, private readonly toastService: ToastService) {}

  getRepo(repoFullName: string) {
    const api = `${this._apiRoot}/repos/${repoFullName}`;
    return this.getWithErrorHandling<RepoSearchResultItem>(api);
  }

  getRepoResults(repoSearch: string, sort: SortParamOptions | null, order: OrderParamOptions | null) {
    const api = `${this._apiRoot}/search/repositories`;
    const params: HttpParamsLiteral = { q: `${repoSearch} in:name` };
    if (sort != null) {
      params.sort = sort;
    }
    if (order != null) {
      params.order = order;
    }
    return this.getWithErrorHandling<RepoSearchResult>(api, { params });
  }

  getIssuesResults(repoFullName: string, sort: SortParamOptions | null, order: OrderParamOptions | null) {
    const api = `${this._apiRoot}/search/issues`;
    const params: HttpParamsLiteral = { q: `repo:${repoFullName}` };
    if (sort != null) {
      params.sort = sort;
    }
    if (order != null) {
      params.order = order;
    }
    return this.getWithErrorHandling<IssueSearchResult>(api, { params });
  }

  private getWithErrorHandling<T>(url: string, options?: { params?: { [param: string]: string | string[] } }): Observable<T | null> {
    return this.http.get<T>(url, options).pipe(
      catchError((error: HttpErrorResponse) => (this.toastService.error(`An error occured: ${error.statusText}`), of(null))),
      share()
    );
  }
}
