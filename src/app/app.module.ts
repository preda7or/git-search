import { NgModule } from "@angular/core";
import { MatAutocompleteModule, MatButtonModule, MatIconModule, MatTableModule, MatToolbarModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TopNavComponent } from "./components/top-nav/top-nav.component";

const materialModules = [MatToolbarModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatTableModule];

@NgModule({
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, ...materialModules],
  declarations: [AppComponent, TopNavComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
