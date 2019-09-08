import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { StateService } from "./state.service";

describe("StateService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
    })
  );

  it("should be created", () => {
    const service: StateService = TestBed.get(StateService);
    expect(service).toBeTruthy();
  });
});
