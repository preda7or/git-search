import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";
import { WINDOW } from "src/app/services/window.service";

@Component({
  selector: "app-issue-search-header",
  templateUrl: "./issue-search-header.component.html",
  styleUrls: ["./issue-search-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueSearchHeaderComponent implements OnInit {
  readonly repoInfo$ = this.stateService.issueRepo$.pipe(
    switchMap((repoId) => (repoId == null ? of({}) : this.gitSearchService.getRepo(repoId)))
  );

  constructor(
    private readonly router: Router,
    @Inject(WINDOW) private readonly window: Window,
    private readonly stateService: StateService,
    private readonly gitSearchService: GitSearchService
  ) {}

  ngOnInit() {}

  onBack(e: MouseEvent) {
    const window = this.window;
    if (window && window.history && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(["/"], { queryParamsHandling: "preserve" });
    }
  }
}
