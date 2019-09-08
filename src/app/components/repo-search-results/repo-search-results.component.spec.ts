import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { async, fakeAsync, TestBed } from "@angular/core/testing";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
} from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { of } from "rxjs";

import { GitSearchService } from "src/app/services/git-search.service";

import { RepoInfoChartComponent } from "../repo-info-chart/repo-info-chart.component";
import { RepoSearchResultsComponent } from "./repo-search-results.component";

const materialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
];

describe("RepoSearchResultsComponent", () => {
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ...materialModules],
      providers: [
        {
          provide: ActivatedRoute,
          /** we will mock it further in our tests */
          useValue: {},
        },
      ],
      declarations: [RepoSearchResultsComponent, RepoInfoChartComponent],
    }).compileComponents();
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * A bit more complex than a unit test. The goal is to see if the query params are passed through,
   * and a api call is initated correctly
   */

  it("should initiate API call based on query params - just name", fakeAsync(() => {
    const gitSearchService = TestBed.get(GitSearchService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.queryParamMap = of(new Map<string, string>([["repoSearch", "testRepoName"]]));

    const searchSpy = spyOn(gitSearchService, "getRepoResults").and.callThrough();
    const queryParamMapMock = spyOn(activatedRoute.queryParamMap, "subscribe").and.callThrough();

    const fixture = TestBed.createComponent(RepoSearchResultsComponent);
    expect(queryParamMapMock).toHaveBeenCalled();
    fixture.detectChanges();
    expect(searchSpy).toHaveBeenCalledWith({ name: "testRepoName", sort: "", order: "", pageIndex: null, pageSize: null });
    const req = httpMock.expectOne({ method: "GET", url: `https://api.github.com/search/repositories?q=testRepoName+in:name` });
    req.flush({});
  }));

  it("should initiate API call based on query params - with additonal params", fakeAsync(() => {
    const gitSearchService = TestBed.get(GitSearchService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.queryParamMap = of(
      new Map<string, string>([
        ["repoSearch", "testRepoName"],
        ["repoOrder", "desc"],
        ["repoSort", "stars"],
        ["repoPageIndex", "10"],
        ["repoPageSize", "100"],
      ])
    );

    const searchSpy = spyOn(gitSearchService, "getRepoResults").and.callThrough();
    const queryParamMapMock = spyOn(activatedRoute.queryParamMap, "subscribe").and.callThrough();

    const fixture = TestBed.createComponent(RepoSearchResultsComponent);
    expect(queryParamMapMock).toHaveBeenCalled();
    fixture.detectChanges();
    expect(searchSpy).toHaveBeenCalledWith({ name: "testRepoName", sort: "stars", order: "desc", pageIndex: 10, pageSize: 100 });
    const req = httpMock.expectOne({
      method: "GET",
      url: `https://api.github.com/search/repositories?q=testRepoName+in:name&order=desc&sort=stars&page=11&per_page=100`,
    });
    req.flush({});
  }));
});
