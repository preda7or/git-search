import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material";

import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map, pairwise, shareReplay, startWith, switchMap, tap } from "rxjs/operators";
import { RepoSearchResult, RepoSearchResultItem } from "src/models/repo-search-result.model";
import { RepoSearchConfig } from "src/models/search-configs";
import { HasLoadingState } from "src/utils/has-loading-state.base";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";

const Columns: Array<{ key: keyof RepoSearchResultItem; title: string }> = [
  { key: "full_name", title: "Name" },
  { key: "html_url", title: "URL" },
  { key: "description", title: "Description" },
  { key: "updated_at", title: "Updated" },
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

  readonly results$ = new BehaviorSubject<RepoSearchResult>({ total_count: 0, items: [] });

  readonly pageIndex$ = this.stateService.repoSearch$.pipe(map((searchConfig) => searchConfig.pageIndex || 1));
  readonly pageSize$ = this.stateService.repoSearch$.pipe(map((searchConfig) => searchConfig.pageSize || 30));

  readonly repoSearch$ = this.stateService.repoSearch$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  hideResults = true;

  constructor(
    readonly cdr: ChangeDetectorRef,
    private readonly stateService: StateService,
    private readonly gitSearchService: GitSearchService
  ) {
    super(cdr);

    super.addSubjects(this.results$);
  }

  ngOnInit() {
    super.addSubscription(
      this.stateService.repoSearch$
        .pipe(
          /**
           * Hide results table between different name searches, but not when we just page or sort
           */
          startWith((null as any) as RepoSearchConfig),
          distinctUntilChanged(),
          pairwise(),
          tap(([prev, curr]) => (curr == null || (prev != null && prev.name !== curr.name) ? (this.hideResults = true) : void 0)),
          map(([prev, curr]) => curr),
          /**
           * Show loading spinner
           */
          tap(() => {
            this.loading = true;
          }),
          switchMap((searchConfig) => this.gitSearchService.getRepoResults(searchConfig)),
          tap(() => {
            this.hideResults = false;
            this.loading = false;
          })
        )
        .subscribe(this.results$)
    );
  }

  onPageChange(e: PageEvent) {
    this.stateService.updateRepoPagination(e.pageIndex, e.pageSize);
  }
}
