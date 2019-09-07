import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material";

import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { IssueSearchResultItem } from "src/models/issue-search-result.model";
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

  readonly results$ = new BehaviorSubject<IssueSearchResultItem[]>([]);
  readonly resultsLength$ = new BehaviorSubject<number>(0);
  readonly pageIndex$ = new BehaviorSubject<number>(0);
  readonly pageSize$ = new BehaviorSubject<number>(30);

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
      combineLatest([this.stateService.issueRepo$, this.stateService.issueSort$, this.stateService.issueOrder$])
        .pipe(
          filter(([repoName]) => repoName != null && repoName !== ""),
          tap(() => (this.loading = true)),
          // tslint:disable-next-line: no-non-null-assertion
          switchMap(([repoName, sort, order]) => this.gitSearchService.getIssuesResults(repoName!, sort, order))
        )
        .subscribe((result) => {
          this.loading = false;
          this.results$.next(result.items);
          this.resultsLength$.next(result.total_count);
        },(error)=>this.toast)
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
