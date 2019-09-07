import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { RepoSearchResult } from "src/models/repo-search-result.model";

export enum SortParamOptions {
  stras = "stars",
  forks = "forks",
  helpWanted = "help-wanted-issues",
  updated = "updated",
}

export enum OrderParamOptions {
  desc = "desc",
  asc = "asc",
}

@Injectable({ providedIn: "root" })
export class GitSearchService {
  constructor(private http: HttpClient) {}

  getRepoResults(repoName: string, sort: SortParamOptions | null, order: OrderParamOptions | null) {
    const api = "https://api.github.com/search/repositories";
    const params: { [param: string]: string } = { q: `${repoName} in:name` };
    if (sort != null) {
      params.sort = sort;
    }
    if (order != null) {
      params.order = order;
    }
    return this.http.get<RepoSearchResult>(api, { params });
  }
}
