import { Component , TemplateRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataAcquireService } from './data-acquire.service';
import { WeatherAcquireService } from './weather-acquire.service';
import { GgGeocoderService } from './gg-geocoder.service';

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
  public min_zoom = 12;
  public max_zoom = 16;
  public have_connection_errors = false;
  success_load = false;

  // Data Containers
  public near_objects_warning = [];
  public near_objects_denied = [];
  public airports = [];
  public airports_loaded = [];
  public current_weather = {
    wind: {
      dir: 0,
      speed: 0,
      human_direction: 'xx'
    },
    temperature: 0,
    presure: 0,
    humidity: 0,
    visibility: 0
  };
  public geo_ref = {
    result: [],
    status: ""
  }

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

    this.setInitialPilotPosition();
    this.uCanFlight();
    this.getWeatherLayer();
    setTimeout( () => { this.getWeatherLayer(); }, 3000); }

  constructor (private _airports: DataAcquireService,
               private _weather: WeatherAcquireService,
               private _geocoder: GgGeocoderService) { }

  private setInitialPilotPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
        this.uCanFlight();
        this.getAirportsData();
        console.log('Latitude: ' + this.lat + ' and Longitude: ' + this.lng);
      });
    }
  }
  searchForPlaces(event) {
    const s: string = event
    if (s.length > 2) {
      this._geocoder.getLatLngFromGG(s).subscribe(
        data => { 
                  this.geo_ref.status = data.status;
                  this.geo_ref.result = data.results
                  console.log(this.geo_ref.result);
                },
        err => console.log(err),
        () => console.log('GEO Successful loaded.')
      );
      console.log(event);
    }
  }

  goToDestination() {
    console.log('Pan to Destination');
  }

  private getNearetObjectsWarning() {
    this.getNearetObjectsDenied();
    this._airports.getNearAirports(this.lat, this.lng, this.near_airports_warning_distance).subscribe(
      data => {
        this.near_objects_warning.length = 0;
        for (const wa of data.results ) {
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
        for (const da of data.results ) {
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
    if ( true ) {

      this.informed = false;
      this.success_load = false;
      // this.airports.length = 0;
      this._airports.getNearAirports(this.lat, this.lng, 10000).subscribe(
        data => {
          for (const a of data.results ) {
            if (this.airports_loaded.indexOf(a.local_identifier) < 0) {
                  this.is_loading = true;
                  this.airports_loaded.push(a.local_identifier);
                  this.airports.push({
                                      lat: a.the_geom.properties.gg_point_coordinates[0],
                                      lng: a.the_geom.properties.gg_point_coordinates[1],
                                      local: a.local_identifier,
                                      name: a.human_readable_identifier,
                                    });
                                    this.is_loading = false;
            }

          }
          // console.log(this.airports);
        },
        err => {
                 this.have_connection_errors = true;
                 console.log('Sorry, but we\'re having problems to connect with DPS');
               },
        () => {
                this.is_loading = false;
                this.success_load = true;
                console.log('Airports Data updated successful loaded.');
              }
      );
    }
  }

  uCanFlight () {
    // this.is_loading = true;
    this.getNearetObjectsWarning();
    this.getWeatherLayer();
    this.getAirportsData();
    // this.is_loading = false;
  }

  printSomeStats(event) {
    // Nothing
  }

  pickPosition(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.uCanFlight();
    // this.getAirportsData();
    console.log('Moved to lat: ' + this.lat + ', lng: ' + this.lng);
  }
  parseWindtoHuman() {
    switch (true) {
      case ( this.current_weather.wind.dir > 0 && this.current_weather.wind.dir <= 11 ||
            this.current_weather.wind.dir > 349 && this.current_weather.wind.dir <= 0):
        this.current_weather.wind.human_direction = 'N'; break;
      case ( this.current_weather.wind.dir > 11 && this.current_weather.wind.dir <= 34 ):
        this.current_weather.wind.human_direction = 'NNE'; break;
      case ( this.current_weather.wind.dir > 34 && this.current_weather.wind.dir <= 56 ):
        this.current_weather.wind.human_direction = 'NE'; break;
      case ( this.current_weather.wind.dir > 56 && this.current_weather.wind.dir <= 79 ):
        this.current_weather.wind.human_direction = 'ENE'; break;
      case ( this.current_weather.wind.dir > 79 && this.current_weather.wind.dir <= 101 ):
        this.current_weather.wind.human_direction = 'E'; break;
      case ( this.current_weather.wind.dir > 101 && this.current_weather.wind.dir <= 124 ):
        this.current_weather.wind.human_direction = 'ESE'; break;
      case ( this.current_weather.wind.dir > 124 && this.current_weather.wind.dir <= 147 ):
        this.current_weather.wind.human_direction = 'SE'; break;
      case ( this.current_weather.wind.dir > 147 && this.current_weather.wind.dir <= 169 ):
        this.current_weather.wind.human_direction = 'SE'; break;
      case ( this.current_weather.wind.dir > 169 && this.current_weather.wind.dir <= 191 ):
        this.current_weather.wind.human_direction = 'S'; break;
      case ( this.current_weather.wind.dir > 191 && this.current_weather.wind.dir <= 214 ):
        this.current_weather.wind.human_direction = 'SSW'; break;
      case ( this.current_weather.wind.dir > 214 && this.current_weather.wind.dir <= 236 ):
        this.current_weather.wind.human_direction = 'SW'; break;
      case ( this.current_weather.wind.dir > 236 && this.current_weather.wind.dir <= 259 ):
        this.current_weather.wind.human_direction = 'WSW'; break;
      case ( this.current_weather.wind.dir > 259 && this.current_weather.wind.dir <= 282 ):
        this.current_weather.wind.human_direction = 'W'; break;
      case ( this.current_weather.wind.dir > 282 && this.current_weather.wind.dir <= 304 ):
        this.current_weather.wind.human_direction = 'WNW'; break;
      case ( this.current_weather.wind.dir > 304 && this.current_weather.wind.dir <= 326 ):
        this.current_weather.wind.human_direction = 'NW'; break;
      case ( this.current_weather.wind.dir > 326 && this.current_weather.wind.dir <= 349 ):
        this.current_weather.wind.human_direction = 'NNW'; break;
    }
  }
  getWeatherLayer() {
    this._weather.getCurrentWeather(this.lat, this.lng).subscribe(
      data => {
                this.current_weather.wind.dir = Math.round(data.wind.deg);
                this.current_weather.wind.speed = Math.round(data.wind.speed);
                this.current_weather.visibility = data.visibility;
                this.current_weather.temperature = data.main.temp - 273.15;
                // console.log('WIND Speed: ' + this.current_weather.wind.speed + 'km/h Dir: ' + this.current_weather.wind.dir + 'deg.');
                // console.log(data);
              },
      err => { console.log(err); },
      () => { this.parseWindtoHuman();
              console.log( 'Current Weather successful loaded.' );}
    );
  }

  rotateWind () {
    let styles = {
        'transform': 'rotate(' + this.current_weather.wind.dir + 'deg)'
    }
    return styles;
  }
}


