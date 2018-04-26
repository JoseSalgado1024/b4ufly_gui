import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
    }
  )
};

@Injectable()
export class GgGeocoderService {
  private gg_ak: string; 
  public geocoder_api_home: string;

  constructor( private http: HttpClient ) { 
    this.gg_ak = 'AIzaSyDbhCrdAzmNDaXgabM4-KoVQQUmD9zSX64';
    this.geocoder_api_home = 'https://maps.googleapis.com/maps/api/geocode/json'; 
  }

  getLatLngFromGG ( private _query: string ): Observable<any> {
    _query = _query.replace( ' ', '+' );
    const endpoint = this.geocoder_api_home + '?address=' + _query + '&key=' + this.gg_ak;
    return this.http.get(endpoint);
  }
}
