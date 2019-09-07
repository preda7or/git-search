import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { GitSearchService } from "src/app/services/git-search.service";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-repo-info-chart",
  templateUrl: "./repo-info-chart.component.html",
  styleUrls: ["./repo-info-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoInfoChartComponent implements OnInit {
  readonly repoInfo$ = this.stateService.issueRepo$.pipe(
    switchMap((repoId) => (repoId == null ? of({}) : this.gitSearchService.getRepo(repoId)))
  );

  constructor(private readonly stateService: StateService, private readonly gitSearchService: GitSearchService) {}

  ngOnInit() {}
}
