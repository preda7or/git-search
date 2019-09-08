import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material";

import { map, shareReplay } from "rxjs/operators";
import { OrderParamOptions, RepoSortParamOptions } from "src/models/repo-search-params";

import { StateService } from "src/app/services/state.service";

const RepoSortOptions: { [key in RepoSortParamOptions | ""]: string } = {
  "": "Best match",
  stars: "Stars",
  "help-wanted-issues": "Help wanted",
  updated: "Updated",
  forks: "Forks",
};

@Component({
  selector: "app-repo-search-field",
  templateUrl: "./repo-search-field.component.html",
  styleUrls: ["./repo-search-field.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoSearchFieldComponent {
  repoName: string = this.stateService.repoSearchName || "";

  sort$ = this.stateService.repoSearch$.pipe(
    map((searchConfig) => searchConfig.sort),
    shareReplay(1)
  );
  order$ = this.stateService.repoSearch$.pipe(
    map((searchConfig) => searchConfig.order),
    shareReplay(1)
  );

  sortOptions = RepoSortOptions;

  constructor(private readonly stateService: StateService) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.stateService.searchReposByName(this.repoName);
  }

  onSortChange(change: MatButtonToggleChange) {
    this.stateService.updateRepoSort({ repoSort: change.value });
  }

  onToggleOrder() {
    const repoOrder: OrderParamOptions = this.stateService.repoSearchOrder === "desc" ? "asc" : "desc";
    this.stateService.updateRepoSort({ repoOrder });
  }
}
