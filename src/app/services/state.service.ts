import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";
import { IssueSortParamOptions, OrderParamOptions, RepoSortParamOptions } from "src/models/repo-search-params";
import { IssueSearchConfig, RepoSearchConfig } from "src/models/search-configs";
import { AutoUnsubscribe } from "src/utils/auto-unsubscribe.base";

@Injectable({ providedIn: "root" })
export class StateService extends AutoUnsubscribe implements OnDestroy {
  /**
   * To accomodate sharing of a state via a link we use queryparams to
   * track the state of repo search and issue listing separately.
   */

  readonly repoSearch$ = new BehaviorSubject<RepoSearchConfig>({ name: "", sort: "", order: "", pageIndex: null, pageSize: null });

  /**
   * The full_name of the repo from which we are listing the issues are provided to the service
   * from the isssue page, due to the nature of inital navigation on loading the app.
   */
  readonly issueRepo$ = new BehaviorSubject<string | null>(null);
  readonly issueSearch$ = new BehaviorSubject<IssueSearchConfig>({ sort: "", order: "", pageIndex: null, pageSize: null });

  get repoSearchName() {
    return this.repoSearch$.getValue().name;
  }
  get repoSearchSort() {
    return this.repoSearch$.getValue().sort;
  }
  get repoSearchOrder() {
    return this.repoSearch$.getValue().order;
  }

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    super();

    super.addSubscription(
      this.route.queryParamMap.subscribe((params) => {
        this.repoSearch$.next({
          name: params.get("repoSearch") || "",
          sort: (params.get("repoSort") as RepoSortParamOptions) || "",
          order: (params.get("repoOrder") as OrderParamOptions) || "",
          pageIndex: parseInt(params.get("repoPageIndex") || "", 10) || null,
          pageSize: parseInt(params.get("repoPageSize") || "", 10) || null,
        });

        this.issueSearch$.next({
          sort: (params.get("issueSort") as IssueSortParamOptions) || "",
          order: (params.get("issueOrder") as OrderParamOptions) || "",
          pageIndex: parseInt(params.get("issuePageIndex") || "", 10) || null,
          pageSize: parseInt(params.get("issuePageSize") || "", 10) || null,
        });
      })
    );

    super.addSubjects(this.repoSearch$, this.issueRepo$, this.issueSearch$);
  }

  /**
   * In the queryParams:
   * set: repoName
   * keep: sort, order, pageSize
   * discard others (pageIndex)
   * @param e Repo search form submit event
   */

  searchReposByName(repoSearch: string) {
    this.router.navigate([], { queryParams: { repoSearch, repoPageIndex: null }, queryParamsHandling: "merge" });
  }

  /**
   * We merge the changed sorting parameters with the existing query parameters
   * for the repo search...
   */
  updateRepoSort(config: { repoSort?: RepoSortParamOptions; repoOrder?: OrderParamOptions }) {
    const prevSearchConfig = this.repoSearch$.getValue();
    /** Merge with previous sort config but reset page index to 0! */
    const currConfig = { repoPageIndex: 0, repoSort: prevSearchConfig.sort, repoOrder: prevSearchConfig.order, ...config };
    this.router.navigate([], {
      queryParams: currConfig,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  updateRepoPagination(repoPageIndex: number | null, repoPageSize: number | null) {
    this.router.navigate([], { queryParams: { repoPageIndex, repoPageSize }, replaceUrl: true, queryParamsHandling: "merge" });
  }

  /**
   * ... and for the issue listing.
   */
  updateIssueSort(sort: IssueSortParamOptions, order: OrderParamOptions) {
    // if (sort.active && sort.direction) {
    //   this.router.navigate([], {
    //     queryParams: { issueSort: sort.active, issueOrder: sort.direction },
    //     queryParamsHandling: "merge",
    //     replaceUrl: true,
    //   });
    // } else {
    //   this.router.navigate([], { queryParams: {}, replaceUrl: true });
    // }
  }

  updateIssuePagination(issuePageIndex: number | null, issuePageSize: number | null) {
    this.router.navigate([], { queryParams: { issuePageIndex, issuePageSize }, replaceUrl: true, queryParamsHandling: "merge" });
  }
}
