import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IssueSearchPageComponent } from "./components/issue-search-page/issue-search-page.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RepoSearchPageComponent } from "./components/repo-search-page/repo-search-page.component";

const routes: Routes = [
  {
    path: "",
    component: RepoSearchPageComponent,
  },
  {
    path: "repo/:repoId",
    component: IssueSearchPageComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
