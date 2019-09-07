import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-repo-search-page",
  templateUrl: "./repo-search-page.component.html",
  styleUrls: ["./repo-search-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoSearchPageComponent {}
