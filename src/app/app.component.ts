import { Component , TemplateRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataAcquireService } from './data-acquire.service';
import { WeatherAcquireService } from './weather-acquire.service';

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
  public airports_loaded = false;
  public have_connection_errors = false;

  // Data Containers
  public near_objects_warning = [];
  public near_objects_denied = [];
  public airports = [];
  public current_weather = {
    wind: 0,
    temperature: 0,
    visibility: 0
  };

  // Data Filters & Defaults
  public lat = -37.259949;
  public lng = -65.564819;
  public zoom = 10;
  public near_airports_warning_distance = 5000;
  public near_airports_denied_distance = 1000;
  public viewport_range = Math.round(2000000 / this.zoom );
  public liftoff_time_icon = 'assets/default-theme/icons_dot-theme-allow-green.png';

  ngOnInit() {
    /**
     * OnInit:
     * ======
     *
     * Llamaremos a uCanFlght, para tener lista la respuesta al usuario antes de la carga de todos los AD/HEL.
     * Luego de consultar las posibilidades de vuelo, procedemos a lanzar al carga de AD/HELs
    */
    this.uCanFlight();
    this.getAirportsData();
  }

  constructor (private _airports: DataAcquireService,
               private _weather: WeatherAcquireService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        this.uCanFlight();
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
            this.near_objects_warning.push(wa.human_readable_identifier);
          }
        }
        // console.log( 'WOC: ' + this.near_objects_warning.length + '.' );
      },
      err => console.log(err),
      () => {
              if ( this.near_objects_denied.length === 0 && this.near_objects_warning.length === 0) {
                    this.liftoff_time_icon = 'assets/default-theme/icons_liftoff-time-granted-double-size.png';
                    this.can_fly = 0;
                    console.log('Great! time to liftof \\o/, u can fly!');
              } else if ( this.near_objects_denied.length > 0 ) {
                    this.liftoff_time_icon = 'assets/default-theme/icons_liftoff-time-forbidden-double-size.png';
                    this.can_fly = 2;
                    console.log('Can\'t flight');
              } else {
                    this.liftoff_time_icon = 'assets/default-theme/icons_liftoff-time-warning-double-size.png';
                    this.can_fly = 1;
                    console.log('You can flight, but few restrictions apply.');
              }
              console.log('Nearest Objects (Warning) successful loaded!.');
            }
    );
  }

  private getNearetObjectsDenied() {
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_denied_distance).subscribe(
      data => {
        if (this.near_objects_denied.length > 0) {
          this.near_objects_denied.length = 0;
        }
        for (let da of data.results ) {
            this.near_objects_denied.push(da.human_readable_identifier);
        }
       //  console.log( 'DOC: ' + this.near_objects_denied.length + '.' );
      },
      err => console.log(err),
      () => {
              console.log('Nearest Objects (Denied) successful loaded!.');
            }
    );
  }

  loading_done() {
    console.log('Executed loading done function.');
    this.is_loading = !this.is_loading;
  }

  i_was_informed() {
    this.informed = !this.informed;
  }
  getAirportsData() {
    if ( !this.airports_loaded ) {
      this.is_loading = true;
      this.informed = false;
      this.airports.length = 0;
      this._airports.getAirportsList().subscribe(
        data => {
          for (let a of data.results ) {
            this.airports.push({
              lat: a.the_geom.properties.gg_point_coordinates[0],
              lng: a.the_geom.properties.gg_point_coordinates[1],
              local: a.local_identifier,
              name: a.human_readable_identifier,
            });
          }
          console.log(this.airports);
        },
        err => {
                 this.have_connection_errors = true;
                 console.log('Sorry, but we\'re having problems to connect with DPS');
               },
        () => {
                this.airports_loaded = true;
                console.log('Airports Data Layer successful loaded.');
              }
      );
    }
  }

  uCanFlight () {
    this.is_loading = true;
    this.getNearetObjectsWarning();
    this.is_loading = false;
  }

  printSomeStats(event) {
    // Nothing
  }

  pickPosition(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.uCanFlight();
    console.log('Moved to lat: ' + this.lat + ', lng: ' + this.lng);
  }
  getWeatherLayer() {
    this._weather.getCurrentWeather(this.lat, this.lng).subscribe(
      data => { console.log(data); },
      err => { console.log(err); },
      () => { console.log('Current Weather successful loaded.'); }
    );
  }
}


