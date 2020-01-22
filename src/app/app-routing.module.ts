import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WeatherChartComponent } from "./weather-chart/weather-chart.component";

const routes: Routes = [
  { path: "weatherchart/:weatherJson", component: WeatherChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
