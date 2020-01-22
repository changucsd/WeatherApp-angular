import {
  Component,
  OnInit,
  OnChanges,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { Capability } from "protractor";
import { HttpClient } from "@angular/common/http";
import { BPClient } from "blocking-proxy";

@Component({
  selector: "app-fav-table",
  templateUrl: "./fav-table.component.html",
  styleUrls: ["./fav-table.component.css"]
})
export class FavTableComponent implements OnInit, OnChanges {
  // @Input() tableData: any;
  @Input() clickedResult: boolean;
  // @Output() searchTarget = new EventEmitter<string>();

  tableData: any;

  // url = "http://localhost:3000/fav";
  // stateUrl: string = "http://localhost:3000/searchState";

  url = "http://eminent-cargo-255521.appspot.com/fav";
  stateUrl: string = "http://eminent-cargo-255521.appspot.com/searchState";

  weatherJson: any;
  cityName: any;
  stateName: any;
  imageUrl: string;

  // display search or table
  showTable: boolean;
  showResult: boolean;
  displayBar: boolean;

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    this.tableData = localStorage;
    // this.showResult = false;

    this.showTable = true;
    this.showResult = false;
    this.displayBar = false;
  }

  ngOnInit() {
    console.log("i am in table comp");
    // console.log(localStorage);
    this.tableData = localStorage;
    this.showTable = true;
    this.showResult = false;
    this.displayBar = false;
  }

  deleteRow(key: string) {
    // var key = city + "," + state;

    localStorage.removeItem(key);
    this.tableData = localStorage;
  }

  searchOn(target: string) {
    this.showTable = false;
    this.showResult = false;
    this.displayBar = true;
    // target is city+,+ state string
    // this.searchTarget.emit(target);

    var city = target.split(",")[0];
    var state = target.split(",")[1];

    this.cityName = city;
    this.stateName = state;

    this.http
      .get<any>(this.url, {
        params: {
          city: city,
          state: state
        }
      })
      .subscribe(data => {
        // console.log(data);

        this.weatherJson = data;
        // http call to get state image
        this.http
          .get<any>(this.stateUrl, {
            params: {
              stateName: state
            }
          })
          .subscribe(data => {
            console.log("got state image json");

            var items = data.items;

            this.imageUrl = items[0].link;

            this.displayBar = false;
            this.showResult = true;

            // console.log(this.imageUrl);
          });
      });
  }
}
