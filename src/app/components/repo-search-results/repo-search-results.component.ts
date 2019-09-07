import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material";

import { BehaviorSubject, combineLatest, of } from "rxjs";
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { OrderParamOptions, SortParamOptions } from "src/models/repo-search-params";
import { RepoSearchResultItem } from "src/models/repo-search-result.model";
import { HasLoadingState } from "src/utils/has-loading-state.base";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";

const Columns: Array<{ key: keyof RepoSearchResultItem; title: string }> = [
  { key: "full_name", title: "Name" },
  { key: "url", title: "URL" },
  { key: "description", title: "Description" },
  { key: "forks_count", title: "Forks count" },
  { key: "stargazers_count", title: "Stargazers count" },
  { key: "open_issues_count", title: "Open issues count" },
];

@Component({
  selector: "app-repo-search-results",
  templateUrl: "./repo-search-results.component.html",
  styleUrls: ["../search-results-common.scss", "./repo-search-results.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoSearchResultsComponent extends HasLoadingState implements OnInit {
  readonly columns = Columns;
  readonly displayedColumns = Columns.map((column) => column.key);
  readonly pageSizeOptions = [10, 30, 50, 100];

  readonly results$ = new BehaviorSubject<RepoSearchResultItem[]>([]);
  readonly resultsLength$ = new BehaviorSubject<number>(0);
  readonly pageIndex$ = new BehaviorSubject<number>(0);
  readonly pageSize$ = new BehaviorSubject<number>(30);

  readonly repoSearch$ = this.stateService.repoSearch$.pipe(
    map((repoSearch) =>
      repoSearch == null || repoSearch.name == null || repoSearch.name === ""
        ? null
        : (repoSearch as {
            name: string;
            sort: SortParamOptions | null;
            order: OrderParamOptions | null;
          })
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly resultsPage$ = combineLatest([this.results$, this.pageSize$, this.pageIndex$]).pipe(
    map(([results, pageSize, pageIndex]) => results.slice(pageSize * pageIndex, pageSize * (pageIndex + 1)))
  );

  constructor(
    readonly cdr: ChangeDetectorRef,
    private readonly stateService: StateService,
    private readonly gitSearchService: GitSearchService
  ) {
    super(cdr);

    super.addSubjects(this.results$, this.resultsLength$, this.pageIndex$, this.pageSize$);
  }

  ngOnInit() {
    super.addSubscription(
      this.repoSearch$
        .pipe(
          tap(() => (this.loading = true)),
          switchMap((search) => (search == null ? of(null) : this.gitSearchService.getRepoResults(search.name, search.sort, search.order))),
          catchError(() => of({ total_count: 0, items: [] }))
        )
        .subscribe((result) => {
          this.loading = false;
          if (result != null) {
            this.results$.next(result.items);
            this.resultsLength$.next(result.total_count);
          }
        })
    );
  }

  onPageChange(e: PageEvent) {
    if (e.pageIndex !== e.previousPageIndex) {
      this.pageIndex$.next(e.pageIndex);
    }
    if (e.pageSize !== this.pageSize$.getValue()) {
      this.pageSize$.next(e.pageSize);
    }
  }
}
