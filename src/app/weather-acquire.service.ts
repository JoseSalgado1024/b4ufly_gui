import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders (
    {
      'Content-Type': 'application/json'
    }
  )
};

@Injectable()
export class WeatherAcquireService {
  public weather_api: string;
  public weather_api_ak: string;

  constructor(private http: HttpClient) {
    this.weather_api = 'https://api.openweathermap.org/data/2.5/weather';
    this.weather_api_ak = 'f9b31ba7d13a3439489fcad3c2090cd1';
  }

  getCurrentWeather(lat, lng): Observable<any> {
    const endpoint = this.weather_api + '?lat=' + lat + '&lon=' + lng + '&appid=' + this.weather_api_ak;
    console.log('GET: ' + endpoint + '.');
    return this.http.get(endpoint);
  }
}
