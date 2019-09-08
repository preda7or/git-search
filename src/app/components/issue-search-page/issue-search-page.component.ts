import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AutoUnsubscribe } from "src/utils/auto-unsubscribe.base";

import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-issue-search-page",
  templateUrl: "./issue-search-page.component.html",
  styleUrls: ["./issue-search-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueSearchPageComponent extends AutoUnsubscribe implements OnInit {
  constructor(private readonly route: ActivatedRoute, private readonly stateService: StateService) {
    super();
  }

  ngOnInit() {
    super.addSubscription(
      this.route.paramMap.subscribe((params) => {
        this.stateService.issueRepo$.next(params.get("repoId") || "");
      })
    );
  }
}
