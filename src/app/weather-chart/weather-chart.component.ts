import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js";

import * as CanvasJS from "../../../src/assets/canvasjs.min";

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-weather-chart",
  templateUrl: "./weather-chart.component.html",
  styleUrls: ["./weather-chart.component.css"]
})
export class WeatherChartComponent implements OnInit, OnChanges {
  @Input() weatherJson: JSON;
  @Input() cityName: string;
  @Input() stateName: string;
  @Input() imageUrl: string;

  barChart: any;
  weeklyChart: any;

  twitterUrl: string;
  isFav: boolean;

  // url = "http://localhost:3000/detail";
  url = "http://eminent-cargo-255521.appspot.com/detail";

  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService
  ) {}

  openModalWithComponent = e => {
    var time = e.dataPoint.label;

    var index = 6 - e.dataPoint.x;
    var dailyData = this.weatherJson["daily"].data;

    var timeStamp = dailyData[index].time;
    var lat = this.weatherJson["latitude"];
    var long = this.weatherJson["longitude"];

    // send http request to get detail data
    this.http
      .get<any>(this.url, {
        params: {
          lat: lat,
          long: long,
          timeStamp: timeStamp
        }
      })
      .subscribe(data => {
        // console.log(data);

        // const initialState = {
        //   list: [timeStamp, index, lat, long, data.currently.summary],
        //   title: time
        // };

        var key = data.currently.icon;

        var src: string;
        switch (key) {
          case "clear-day":
          case "clear-night":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
            break;
          case "rain":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
            break;
          case "snow":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
            break;
          case "sleet":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
            break;
          case "wind":
            src =
              "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
            break;
          case "fog":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
            break;
          case "cloudy":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
            break;
          case "partly-cloudy-day":
          case "partly-cloudy-night":
            src =
              "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
            break;
        }

        const initialState = {
          title: time,
          cityName: this.cityName,
          temperature: Math.round(parseFloat(data.currently.temperature)),
          summary: data.currently.summary,
          imgUrl: src,
          precipitation: data.currently.precipIntensity.toFixed(2),
          chanceofRain: (
            parseFloat(data.currently.precipProbability) * 100
          ).toFixed(2),
          windSpeed: parseFloat(data.currently.windSpeed).toFixed(2),
          humidity: (parseFloat(data.currently.humidity) * 100).toFixed(2),
          visibility: data.currently.visibility.toFixed(2)
        };

        this.bsModalRef = this.modalService.show(ModalContentComponent, {
          initialState
        });
        this.bsModalRef.content.closeBtnName = "Close";
      });
  };

  updateChart(e: any) {
    var hourlyData = this.weatherJson["hourly"].data;

    var data = [];
    var label = [];
    var chartName = e;

    console.log(hourlyData.length);

    for (var i = 0; i < hourlyData.length / 2 - 1; i++) {
      label.push(i);
      var object = hourlyData[i];
      // console.log(object['time']);
      if (chartName == "humidity") {
        data.push((parseFloat(object[chartName]) * 100).toFixed(2));
      } else {
        data.push(object[chartName]);
      }
    }

    var maxValue = Math.max(...data) * 1.1;
    var minValue = Math.min(...data) * 0.9;

    // this.chartData = rows;
    var yLabel: string;

    switch (chartName) {
      case "temperature":
        // code block
        yLabel = "Fahrenheit";
        break;
      case "pressure":
        // code block
        yLabel = "Millibars";
        break;
      case "humidity":
        // code block
        yLabel = "%Humidity";
        break;
      case "ozone":
        // code block
        yLabel = "Dobson units";
        break;
      case "visibility":
        // code block
        yLabel = "Miles (Maximum 10)";
        break;
      case "windSpeed":
        // code block
        yLabel = "Miles per Hour";
        break;

      // code block
    }

    this.barChart.data.labels = label;
    this.barChart.data.datasets[0].label = chartName;
    this.barChart.data.datasets[0].data = data;
    this.barChart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
    this.barChart.options.scales.yAxes[0].ticks.suggestedMax = maxValue;
    this.barChart.options.scales.yAxes[0].ticks.suggestedMin = minValue;
    this.barChart.update();
  }

  ngOnChanges() {
    // build new twitterurl

    console.log("in on change");

    var checkKey = this.cityName + "," + this.stateName;
    if (localStorage.getItem(checkKey) == null) {
      this.isFav = false;
    } else {
      this.isFav = true;
    }

    this.twitterUrl =
      "https://twitter.com/intent/tweet?text=The current temperature at " +
      this.cityName +
      " is " +
      this.weatherJson["currently"].temperature +
      "°F. The weather conditions are " +
      this.weatherJson["currently"].summary +
      ".&hashtags=CSCI571WeatherSearch";

    if (this.barChart != null) {
      this.barChart.destroy();
    }
    this.barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: null,
        datasets: [
          {
            label: null,
            data: null,
            backgroundColor: "#ADCFEB",
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: ""
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                suggestedMax: 0
              },
              scaleLabel: {
                display: true,
                labelString: ""
              }
            }
          ]
        }
      }
    });

    this.updateChart("temperature");

    // build new weekly cart
    this.weeklyChart = new CanvasJS.Chart("weeklyChart", {
      animationEnabled: true,
      height: 300, //in pixels
      width: 750,
      dataPointWidth: 18,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days"
      },
      axisY: {
        gridThickness: 0,
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10
      },

      legend: {
        verticalAlign: "top"
      },
      data: [
        {
          type: "rangeBar",
          showInLegend: true,
          legendText: "Day wise temperature range",

          toolTipContent: "<b>{label}</b>:{y[0]} to {y[1]}",
          color: "#ADCFEB",
          indexLabel: "{y[#index]}",
          dataPoints: []
        }
      ]
    });

    var timezone = this.weatherJson["timezone"];

    var dailyData = this.weatherJson["daily"].data;

    for (var i = 0; i < dailyData.length; i++) {
      var time: any = dailyData[i].time;

      time = this.timeConverter(time, timezone);

      var tempHigh = Math.round(dailyData[i].temperatureHigh);
      var tempLow = Math.round(dailyData[i].temperatureLow);

      this.weeklyChart.options.data[0].dataPoints.push({
        x: 6 - i,
        y: [tempLow, tempHigh],
        label: time,
        click: this.openModalWithComponent
      });
    }

    this.weeklyChart.render();
  }

  ngOnInit() {
    // let json = this.route.snapshot.paramMap.get("weatherJson");

    console.log("chart gets json");
    console.log("in on chart INit");

    var checkKey = this.cityName + "," + this.stateName;
    if (localStorage.getItem(checkKey) == null) {
      this.isFav = false;
    } else {
      this.isFav = true;
    }

    this.twitterUrl =
      "https://twitter.com/intent/tweet?text=The current temperature at " +
      this.cityName +
      " is " +
      this.weatherJson["currently"].temperature +
      "°F. The weather conditions are " +
      this.weatherJson["currently"].summary +
      ".&hashtags=CSCI571WeatherSearch";
  }

  timeConverter(UNIX_timestamp: any, timeZone: string) {
    var a: any = new Date(UNIX_timestamp * 1000).toLocaleString("en-US", {
      timeZone: timeZone
    });
    a = new Date(a);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var time = date + "/" + month + "/" + year;
    return time;
  }

  toggleFav() {
    var checkKey = this.cityName + "," + this.stateName;

    if (this.isFav == false) {
      localStorage.setItem(checkKey, this.imageUrl);
    } else {
      localStorage.removeItem(checkKey);
    }

    this.isFav = !this.isFav;
  }

  round(number: any) {
    return Math.round(parseFloat(number));
  }
}

///////////////for modal

/* This is a component which we pass in modal*/

@Component({
  selector: "modal-content",
  template: `
    <div class="modal-header" style="background-color:#6592AD">
      <h4 class="modal-title pull-left">{{ title }}</h4>
      <button
        type="button"
        class="close pull-right"
        aria-label="Close"
        (click)="bsModalRef.hide()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="background-color: #9AD1F1">
      <div class="container">
        <div class="row">
          <div class="col-md-6 ml-3">
            <h3 class="mb-3">{{ cityName }}</h3>
            <h2 class="mb-3">
              {{ temperature }}
              <img
                class="align-top"
                style="height: 1vw; width: 1vw; "
                src="https://cdn3.iconfinder.com/data/icons/virtual-notebook/16/button_shape_oval-512.png"
              />
              F
            </h2>
            <h6 class="mt-2">
              {{ summary }}
            </h6>
          </div>
          <div class="col-md-4 ml-auto">
            <img
              class="mt-4 mr-5"
              style="height: 8vw; width: 8vw;"
              src="{{ imgUrl }}"
            />
          </div>
        </div>
        <hr />
      </div>

      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 ml-auto">
            <h6>Precipitation: {{ precipitation }}</h6>
            <h6>Chance of Rain: {{ chanceofRain }} %</h6>
            <h6>Wind Speed: {{ windSpeed }} mph</h6>
            <h6>Humidity: {{ humidity }} %</h6>
            <h6>Visibility: {{ visibility }} miles</h6>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];

  cityName: string;
  temperature: string;
  summary: string;

  imgUrl: string;

  precipitation: any;
  chanceofRain: any;
  windSpeed: any;
  humidity: any;
  visibility: any;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    // this.list.push("PROFIT!!!");
  }
}
