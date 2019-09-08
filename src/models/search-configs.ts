import { IssueSortParamOptions, OrderParamOptions, RepoSortParamOptions } from "./repo-search-params";

export interface RepoSearchConfig {
  name: string;
  sort: RepoSortParamOptions | "";
  order: OrderParamOptions | "";
  pageIndex: number | null;
  pageSize: number | null;
}

export interface IssueSearchConfig {
  sort: IssueSortParamOptions | "";
  order: OrderParamOptions | "";
  pageIndex: number | null;
  pageSize: number | null;
}
