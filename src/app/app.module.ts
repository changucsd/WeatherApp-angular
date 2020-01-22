import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { ChartsModule } from "ng2-charts";
import { Chart } from "chart.js";
import { StorageServiceModule } from "ngx-webstorage-service";

import { FavTableComponent } from "./fav-table/fav-table.component";
import { WeatherChartComponent } from "./weather-chart/weather-chart.component";
import { ModalContentComponent } from "./weather-chart/weather-chart.component";

import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    WeatherChartComponent,
    FavTableComponent,
    ModalContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ScrollingModule,
    ChartsModule,
    StorageServiceModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot()
    // Chart
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalContentComponent]
})
export class AppModule {}
