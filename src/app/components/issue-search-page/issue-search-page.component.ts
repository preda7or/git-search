import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-issue-search-page',
  templateUrl: './issue-search-page.component.html',
  styleUrls: ['./issue-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueSearchPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
