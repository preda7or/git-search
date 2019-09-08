import { OrderParamOptions, RepoSortParamOptions } from "./repo-search-params";

export interface RepoSearchConfig {
  name: string;
  sort: RepoSortParamOptions | "";
  order: OrderParamOptions | "";
  /**
   * Page index 0 based!
   */
  pageIndex: number | null;
  pageSize: number | null;
}

export interface IssueSearchConfig {
  /**
   * Page index 0 based!
   */
  pageIndex: number | null;
  pageSize: number | null;
}
