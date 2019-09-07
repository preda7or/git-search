import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";
import { RepoSearchResultItem } from "src/models/repo-search-result.model";
import { HasLoadingState } from "src/utils/has-loading-state.base";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";

const Columns = {
  full_name: "Name",
  url: "URL",
  description: "Description",
  forks_count: "Forks count",
  stargazers_count: "Stargazers count",
  open_issues_count: "Open issues count",
};

@Component({
  selector: "app-repo-search-results",
  templateUrl: "./repo-search-results.component.html",
  styleUrls: ["./repo-search-results.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoSearchResultsComponent extends HasLoadingState implements OnInit {
  readonly columns = Columns;
  readonly displayedColumns = Object.keys(Columns);

  readonly results$ = new BehaviorSubject<RepoSearchResultItem[]>([]);
  readonly resultsLength$ = new BehaviorSubject<number>(0);
  readonly pageIndex$ = new BehaviorSubject<number>(0);
  readonly pageSize$ = new BehaviorSubject<number>(30);

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly stateService: StateService,
    private readonly gitSearchService: GitSearchService
  ) {
    super(cdr);
  }

  ngOnInit() {
    super.addSubscription(
      combineLatest([this.stateService.repoName$, this.stateService.sort$, this.stateService.order$])
        .pipe(
          tap(() => (this.loading = true)),
          filter(([repoName]) => repoName != null && repoName !== ""),
          // tslint:disable-next-line: no-non-null-assertion
          switchMap(([repoName, sort, order]) => this.gitSearchService.getRepoResults(repoName!, sort, order))
        )
        .subscribe((result) => {
          this.loading = false;
          this.results$.next(result.items);
          this.resultsLength$.next(result.total_count);
        })
    );
  }
}
