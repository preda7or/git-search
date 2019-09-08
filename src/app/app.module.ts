import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IssueSearchHeaderComponent } from "./components/issue-search-header/issue-search-header.component";
import { IssueSearchPageComponent } from "./components/issue-search-page/issue-search-page.component";
import { IssueSearchResultsComponent } from "./components/issue-search-results/issue-search-results.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RepoInfoChartComponent } from "./components/repo-info-chart/repo-info-chart.component";
import { RepoSearchFieldComponent } from "./components/repo-search-field/repo-search-field.component";
import { RepoSearchPageComponent } from "./components/repo-search-page/repo-search-page.component";
import { RepoSearchResultsComponent } from "./components/repo-search-results/repo-search-results.component";
import { CustomToastComponent } from "./components/toast/toast.component";
import { TopNavComponent } from "./components/top-nav/top-nav.component";
import { WINDOW_PROVIDERS } from "./services/window.service";

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
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
];

@NgModule({
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, HttpClientModule, ...materialModules],
  declarations: [
    AppComponent,
    TopNavComponent,
    PageNotFoundComponent,
    RepoSearchFieldComponent,
    RepoSearchResultsComponent,
    RepoSearchPageComponent,
    IssueSearchPageComponent,
    IssueSearchResultsComponent,
    IssueSearchHeaderComponent,
    CustomToastComponent,
    RepoInfoChartComponent,
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [CustomToastComponent],
})
export class AppModule {}
