import { Component } from '@angular/core';
import { DataAcquireService } from './data-acquire.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // APP setting
  public title = 'app';
  public is_loading = true;

  // Data Containers
  public near_objects_warning = [];
  public near_objects_denied = [];
  public airports = [];

  // Data Filters & Defaults
  public lat = -37.259949;
  public lng = -65.564819;
  public zoom = 10;
  public near_airports_warning_distance = 5000;
  public near_airports_denied_distance = 1000;
  public viewport_range = 200000;
  public lisftoff_time = '0';

  constructor (private _airports: DataAcquireService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        console.log('Latitude: ' + this.lat + ' and Longitude: ' + this.lng);
      });
    }
  }

  private getNearetObjectsWarning() {
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_warning_distance).subscribe(
      data => {
        for (let wa of data.results ) {
          if (this.near_objects_denied.indexOf(wa.local_identifier) < 0) {
            this.near_objects_warning.push(wa.local_identifier);
          }
        }
      },
      err => console.log(err),
      () => console.log('Nearest Objects (Warning) successful loaded!.')
    );
  }

  private getNearetObjectsDenied() {
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_warning_distance).subscribe(
      data => {
        for (let da of data.results ) {
            this.near_objects_warning.push(da.local_identifier);
        }
      },
      err => console.log(err),
      () => console.log('Nearest Objects (Denied) successful loaded!.')
    );
  }

  getAirportsData() {
    this.near_objects_warning = [];
    this.near_objects_denied = [];
    this.getNearetObjectsDenied();
    this.getNearetObjectsWarning();
    this._airports.getNearAirports(this.lat, this.lng, this.viewport_range).subscribe(
    data => {
      for (let a of data.results ) {
        this.airports.push({
          lat: a.the_geom.properties.gg_point_coordinates[0],
          lng: a.the_geom.properties.gg_point_coordinates[1],
          local: a.local_identifier,
          name: a.human_readable_identifier,
          warning: this.near_objects_denied.indexOf(a.local_identifier) < 0,
          denied: this.near_objects_denied.indexOf(a.local_identifier) < 0
        });
      }
      if ( this.near_objects_warning.length > 0 ) {
        this.lisftoff_time = '1';
      } else if ( this.near_objects_denied.length > 0 ) {
        this.lisftoff_time = '2';
      }

    },
    err => console.log(err),
    () => {
            this.is_loading = false;
            console.log('Airports Data Layer successful loaded.');
          }
    );
  }

  pickPosition(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.near_objects_denied = [];
    this.near_objects_warning = [];
    this.getAirportsData();
    console.log('Moved to lat: ' + this.lat + ', lng: ' + this.lng);
  }
}


