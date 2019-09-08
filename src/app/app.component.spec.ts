import { async, TestBed } from "@angular/core/testing";
import { MatButtonModule, MatIconModule, MatToolbarModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { TopNavComponent } from "./components/top-nav/top-nav.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatButtonModule, MatIconModule, MatToolbarModule],
      declarations: [AppComponent, TopNavComponent],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should render title in an <a> tag", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("mat-toolbar > a").textContent).toContain("Git Search");
  });
});
