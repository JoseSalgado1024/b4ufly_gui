import { Component } from '@angular/core';
import { DataAcquireService } from './data-acquire.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public initial_lat = -34.573878;
  public initial_lng = -58.488616;
  public initial_zoom = 12;
  buffer_radius = 5000;
  public airports_nearest = [];
  public airports = [];

  constructor (private _airports: DataAcquireService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.initial_lat = position.coords.latitude;
        this.initial_lng = position.coords.longitude;
        this.initial_zoom = 13;
        console.log('Latitude: ' + this.initial_lat + ' and Longitude: ' + this.initial_lng);
      });
    }
  }

  AirportsNearest() {
    // console.log();
    this._airports.getAirPortsNearest(this.initial_lat, this.initial_lng, this.buffer_radius).subscribe(
      data => {
        // console.log(data.results);
        data.results.forEach(element => {
          this.airports_nearest.push(
            {
              lat: element.the_geom.properties.gg_point_coordinates[0],
              lng: element.the_geom.properties.gg_point_coordinates[1],
              name: element.the_geom.properties.name,
              local_identifier: element.local_identifier
            });
        });
      },
      err => console.error(err),
      () => console.log('Successful Airports load!')
    );
  }

  Airports() {
    // console.log();
    this._airports.getAirPortslist().subscribe(
      data => {
        // console.log(data.results);
        data.results.forEach(element => {
          this.airports.push(
            {
              lat: element.the_geom.properties.gg_point_coordinates[0],
              lng: element.the_geom.properties.gg_point_coordinates[1],
              name: element.the_geom.properties.name,
              local_identifier: element.local_identifier
            });
        });
      },
      err => console.error(err),
      () => console.log('Successful Airports load!')
    );
  }

  lookUpFeatures (event) {
    console.log(event);
  }
}


