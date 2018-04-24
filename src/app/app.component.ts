import { Component , TemplateRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataAcquireService } from './data-acquire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  // APP setting
  public title = 'app';
  public is_loading = true;
  public can_fly = 0;
  public informed = false;
  public min_zoom = 18;
  public max_zoom = 8;

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
  public viewport_range = Math.round(2000000 / this.zoom );
  public liftoff_time_icon = 'assets/default-theme/icons_dot-theme-allow-green.png';

  ngOnInit() {
    this.getAirportsData();
  }

  constructor (private _airports: DataAcquireService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        this.getAirportsData();
        console.log('Latitude: ' + this.lat + ' and Longitude: ' + this.lng);
      });
    }
  }

  private getNearetObjectsWarning() {
    this.getNearetObjectsDenied();
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_warning_distance).subscribe(
      data => {
        this.near_objects_warning.length = 0;
        for (let wa of data.results ) {
          if (this.near_objects_denied.indexOf(wa.local_identifier) < 0) {
            this.near_objects_warning.push(wa.local_identifier);
          }
        }
        // console.log( 'WOC: ' + this.near_objects_warning.length + '.' );
      },
      err => console.log(err),
      () => console.log('Nearest Objects (Warning) successful loaded!.')
    );
  }

  private getNearetObjectsDenied() {
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_denied_distance).subscribe(
      data => {
        if (this.near_objects_denied.length > 0) {
          this.near_objects_denied.length = 0;
        }
        for (let da of data.results ) {
            this.near_objects_denied.push(da.local_identifier);
        }
       //  console.log( 'DOC: ' + this.near_objects_denied.length + '.' );
      },
      err => console.log(err),
      () => console.log('Nearest Objects (Denied) successful loaded!.')
    );
  }
  i_was_informed() {
    this.informed = !this.informed;
  }
  getAirportsData() {
    this.is_loading = true;
    this.informed = false;
    this.airports.length = 0;
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
      this.is_loading = false;
      if (this.near_objects_warning.length === 0 &&  this.near_objects_denied.length === 0) {
        this.liftoff_time_icon = 'assets/default-theme/icons_dot-theme-allow-green.png';
        this.can_fly = 0;
        console.log('Great! time to liftof \\o/, u can fly!');
      }
      if ( this.near_objects_warning.length > 0 ) {
        this.liftoff_time_icon = 'assets/default-theme/icons_dot-theme-warning-green.png';
        this.can_fly = 1;
        console.log('Can fly, but have some restrictions');
      }
      if ( this.near_objects_denied.length > 0 ) {
        this.liftoff_time_icon = 'assets/default-theme/icons_dot-theme-denied-green.png';
        this.can_fly = 2;
        console.log('Sorry, but you can\'t fly!');
      }

    },
    err => console.log(err),
    () => {
            this.is_loading = false;
            console.log('Airports Data Layer successful loaded.');
          }
    );
  }

  printSomeStats(event) {
    if ( event > this.min_zoom ) {
      // this.zoom = this.min_zoom;
      console.log('Too high');
    }
    if ( event < this.max_zoom ) {
      console.log('Too low');
      this.zoom = this.max_zoom;
    }
    this.viewport_range = Math.round(2000000 / event);
    console.log('event ZOOM: ' + event + ' internal VIEWPORT RANGE: ' + this.viewport_range);
  }

  pickPosition(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.getAirportsData();
    console.log('Moved to lat: ' + this.lat + ', lng: ' + this.lng);
  }
}


