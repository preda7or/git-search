import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material";

import { BehaviorSubject, combineLatest } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { IssueSearchResult, IssueSearchResultItem } from "src/models/issue-search-result.model";
import { HasLoadingState } from "src/utils/has-loading-state.base";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";

const Columns: Array<{ key: keyof IssueSearchResultItem; title: string }> = [
  { key: "created_at", title: "Created" },
  { key: "state", title: "State" },
  { key: "number", title: "#" },
  { key: "title", title: "Title" },
];

@Component({
  selector: "app-issue-search-results",
  templateUrl: "./issue-search-results.component.html",
  styleUrls: ["../search-results-common.scss", "./issue-search-results.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueSearchResultsComponent extends HasLoadingState implements OnInit {
  readonly columns = Columns;
  readonly displayedColumns = Columns.map((column) => column.key);
  readonly pageSizeOptions = [10, 30, 50, 100];

  readonly results$ = new BehaviorSubject<IssueSearchResult>({ total_count: 0, items: [] });

  readonly pageIndex$ = this.stateService.issueSearch$.pipe(map((searchConfig) => searchConfig.pageIndex || 0));
  readonly pageSize$ = this.stateService.issueSearch$.pipe(map((searchConfig) => searchConfig.pageSize || 30));

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
      combineLatest([this.stateService.issueRepo$, this.stateService.issueSearch$])
        .pipe(
          tap(() => {
            /** Loading change invokes change detection in base class! */
            this.loading = true;
          }),
          switchMap(([repoFullname, searchConfig]) => this.gitSearchService.getIssuesResults(repoFullname, searchConfig)),
          tap(() => {
            this.hideResults = false;
            /** Loading change invokes change detection in base class! */
            this.loading = false;
          })
        )
        .subscribe(this.results$)
    );
  }

  onPageChange(e: PageEvent) {
    this.stateService.updateIssuePagination(e.pageIndex, e.pageSize);
  }
}
