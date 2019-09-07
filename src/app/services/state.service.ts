import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, shareReplay } from "rxjs/operators";
import { OrderParamOptions, SortParamOptions } from "src/models/repo-search-params";
import { AutoUnsubscribe } from "src/utils/auto-unsubscribe.base";

@Injectable({ providedIn: "root" })
export class StateService extends AutoUnsubscribe implements OnDestroy {
  private readonly _repoSearchSubject = new BehaviorSubject<{
    name: string | null;
    sort: SortParamOptions | null;
    order: OrderParamOptions | null;
  } | null>(null);
  
  readonly repoSearch$ = this._repoSearchSubject.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly issueRepo$ = new BehaviorSubject<string | null>(null);
  readonly issueSort$ = new BehaviorSubject<SortParamOptions | null>(null);
  readonly issueOrder$ = new BehaviorSubject<OrderParamOptions | null>(null);

  get repoSearchName() {
    const repoSearch = this._repoSearchSubject.getValue();
    return repoSearch == null ? null : repoSearch.name;
  }

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    super();

    super.addSubscription(
      this.route.queryParamMap.subscribe((params) => {
        this._repoSearchSubject.next({
          name: params.get("repoSearch") || null,
          sort: (params.get("repoSort") as SortParamOptions) || null,
          order: (params.get("repoOrder") as OrderParamOptions) || null,
        });

        this.issueSort$.next((params.get("issueSort") as SortParamOptions) || null);
        this.issueOrder$.next((params.get("issueOrder") as OrderParamOptions) || null);
      })
    );

    super.addSubjects(
      this._repoSearchSubject,
      this.issueRepo$,
      this.issueSort$,
      this.issueOrder$
    );
  }

  /**
   * In the queryParams:
   * set: repoName,
   * discard everything else (event sort and order)
   * @param e Repo search form submit event
   */

  searchReposByName(repoSearch: string) {
    this.router.navigate([], { queryParams: { repoSearch } });
  }
}
