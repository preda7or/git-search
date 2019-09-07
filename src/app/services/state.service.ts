import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";
import { AutoUnsubscribe } from "src/utils/auto-unsubscribe.base";

import { OrderParamOptions, SortParamOptions } from "./git-search.service";

@Injectable({ providedIn: "root" })
export class StateService extends AutoUnsubscribe implements OnDestroy {
  readonly queryParams$ = new BehaviorSubject<ParamMap | null>(null);

  readonly repoName$ = new BehaviorSubject<string | null>(null);
  readonly sort$ = new BehaviorSubject<SortParamOptions | null>(null);
  readonly order$ = new BehaviorSubject<OrderParamOptions | null>(null);

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    super();

    super.addSubscription(
      this.route.queryParamMap.subscribe(this.queryParams$),

      this.queryParams$.subscribe((params) => {
        if (params == null) {
          return;
        }
        this.repoName$.next(params.get("repoName") || null);
        this.sort$.next(params.get("sort") as SortParamOptions || null);
        this.order$.next(params.get("order") as OrderParamOptions || null);
      })
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.queryParams$.complete();
  }

  /**
   * In the queryParams:
   * set: repoName,
   * keep: sortBy, order
   * discard everything else
   * @param e Repo search form submit event
   */

  searchReposByName(repoName: string) {
    this.router.navigate([], { queryParams: { repoName } });
  }
}
