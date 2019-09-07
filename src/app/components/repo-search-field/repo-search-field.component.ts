import { ChangeDetectionStrategy, Component } from "@angular/core";

import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-repo-search-field",
  templateUrl: "./repo-search-field.component.html",
  styleUrls: ["./repo-search-field.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoSearchFieldComponent {
  repoName: string = this.stateService.repoName$.getValue() || "";

  constructor(private readonly stateService: StateService) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.stateService.searchReposByName(this.repoName);
  }
}
