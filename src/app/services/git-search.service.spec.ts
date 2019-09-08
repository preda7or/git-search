import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";

import { GitSearchService } from "./git-search.service";

describe("GitSearchService", () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule] }));

  it("should be created", () => {
    const service: GitSearchService = TestBed.get(GitSearchService);
    expect(service).toBeTruthy();
  });
});
