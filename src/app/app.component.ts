import { Component, OnInit, Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ChildrenOutletContexts } from "@angular/router";

import { Observable, of, from } from "rxjs";
import { map, startWith, catchError, tap } from "rxjs/operators";

import { analyzeAndValidateNgModules } from "@angular/compiler";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "project8";
  // url = "http://localhost:3000/submit";
  // autoCompleteUrl = "http://localhost:3000/auto";
  // stateUrl: string = "http://localhost:3000/searchState";

  url = "http://eminent-cargo-255521.appspot.com/submit";
  autoCompleteUrl = "http://eminent-cargo-255521.appspot.com/auto";
  stateUrl: string = "http://eminent-cargo-255521.appspot.com/searchState";

  localLat: string;
  localLon: string;

  weatherJson: any; // got from input or current location and sent to ChildrenComp

  currentCity: string;
  currentState: string;

  // store searched city, state and url for children
  imageUrl: string = "";
  cityName: string;
  stateName: string;

  // progress bar indicator
  displayBar: boolean;

  // show results or fav
  resultToggle: boolean;
  favToggle: boolean;

  // used to refresh fav table component
  dummy: boolean;

  // used to get invalid input message

  isInvalid: boolean;
  // options for autocomplete
  filteredOptions: Observable<string[]>;

  // data form form
  formData = new FormGroup({
    street: new FormControl("", Validators.required),
    city: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    locationBox: new FormControl("")
  });

  constructor(private http: HttpClient) {
    this.localLat = "";
    this.localLon = "";
  }

  ngOnInit(): void {
    this.dummy = false;
    this.isInvalid = false;

    this.displayBar = false;
    this.resultToggle = true;
    this.favToggle = false;

    // get local address
    this.http.get<Object>("http://ip-api.com/json").subscribe(data => {
      this.localLat = data["lat"];
      this.localLon = data["lon"];
      this.currentCity = data["city"];
      this.currentState = data["regionName"];
    });

    // detect city input change for auto complete
    this.formData.get("city").valueChanges.subscribe(val => {
      if (val != null) {
        this.filteredOptions = this.requestCity(val);
      }
    });
  }

  onSubmit() {
    // this.dummy1 = !this.dummy1;
    this.displayBar = true;
    // this.resultToggle = false;
    this.isInvalid = false;

    this.weatherJson = null;

    this.http
      .get<Object>(this.url, {
        params: {
          street: this.formData.controls["street"].value,
          city: this.formData.controls["city"].value,
          state: this.formData.controls["state"].value,
          locationBox: this.formData.controls["locationBox"].value,
          localLat: this.localLat,
          localLon: this.localLon
        }
      })
      .subscribe(data => {
        // console.log("data from submit click");

        if (data["status"] == "ZERO_RESULTS") {
          console.log("get zero result: bad input");

          this.displayBar = false;
          this.isInvalid = true;

          this.weatherJson = null;

          // this.resultToggle = true;
          // this.clickResult();

          return;
        }

        this.weatherJson = data;

        if (this.formData.controls["locationBox"].value == true) {
          this.cityName = this.currentCity;
          this.stateName = this.abbrState(this.currentState);
        } else {
          this.cityName = this.formData.controls["city"].value;
          this.stateName = this.formData.controls["state"].value;
        }

        // http call to get state image
        this.http
          .get<any>(this.stateUrl, {
            params: {
              stateName: this.stateName
            }
          })
          .subscribe(data => {
            console.log("got state image json");
            console.log(data);

            var items = data.items;

            this.imageUrl = items[0].link;
            console.log(this.imageUrl);

            this.displayBar = false;
            // this.resultToggle = true;

            this.clickResult();
          });
      });
  }

  clearPage() {
    this.weatherJson = null;
    this.imageUrl = "";

    this.formData.reset();
    this.formData.controls["street"].enable();
    this.formData.controls["city"].enable();
    this.formData.controls["state"].enable();
    this.formData.controls["state"].setValue("");
    this.clickResult();

    // clear invalid message
    this.isInvalid = false;
    // localStorage.clear();
  }

  toggle(e: any) {
    // console.log(e);
    if (e.target.checked) {
      console.log("This is checked");

      this.formData.reset({
        street: "",
        city: "",
        state: "",
        locationBox: "e.target.checked"
      });

      this.formData.controls["street"].setErrors(null);
      this.formData.controls["city"].setErrors(null);
      this.formData.controls["state"].setErrors(null);

      this.formData.controls["street"].disable();
      this.formData.controls["city"].disable();
      this.formData.controls["state"].disable();
    } else {
      console.log("unchecked");

      this.formData.controls["street"].enable();
      this.formData.controls["city"].enable();
      this.formData.controls["state"].enable();
    }
  }

  private requestCity(filterValue: string): Observable<string[]> {
    // console.log("in request");
    // console.log(filterValue);
    filterValue = filterValue.toLowerCase();
    return this.http
      .get<any>(this.autoCompleteUrl, {
        params: {
          input: filterValue
        }
      })
      .pipe(tap(_ => console.log("got autocomplete data")));
  }

  clickFav() {
    this.resultToggle = false;
    this.favToggle = true;
    this.dummy = !this.dummy;
  }

  clickResult() {
    this.resultToggle = true;
    this.favToggle = false;
  }

  // full state name to abbrev
  abbrState(input: string) {
    let stateList = {
      Arizona: "AZ",
      Alabama: "AL",
      Alaska: "AK",
      Arkansas: "AR",
      California: "CA",
      Colorado: "CO",
      Connecticut: "CT",
      Delaware: "DE",
      Florida: "FL",
      Georgia: "GA",
      Hawaii: "HI",
      Idaho: "ID",
      Illinois: "IL",
      Indiana: "IN",
      Iowa: "IA",
      Kansas: "KS",
      Kentucky: "KY",
      Louisiana: "LA",
      Maine: "ME",
      Maryland: "MD",
      Massachusetts: "MA",
      Michigan: "MI",
      Minnesota: "MN",
      Mississippi: "MS",
      Missouri: "MO",
      Montana: "MT",
      Nebraska: "NE",
      Nevada: "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      Ohio: "OH",
      Oklahoma: "OK",
      Oregon: "OR",
      Pennsylvania: "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      Tennessee: "TN",
      Texas: "TX",
      Utah: "UT",
      Vermont: "VT",
      Virginia: "VA",
      Washington: "WA",
      "West Virginia": "WV",
      Wisconsin: "WI",
      Wyoming: "WY"
    };

    return stateList[input];
  }

  // searchFromFav(target: string) {
  //   console.log("in searchformFav");
  //   console.log(target);
  // }
}
