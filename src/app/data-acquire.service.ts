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
export class DataAcquireService {
  /* Public properties */
  public api_home: string;
  public api_search: string;
  public api_near: string;

  constructor(private http: HttpClient) {
    /* MAIN CONSTRUCTOR */
    this.api_home = 'http://datos.anac.gob.ar/madhel/api/v2';
    this.api_search = this.api_home + '/' + 'airports';
    this.api_near = this.api_search + '/' + 'near';
  }

  getAirportDetails(local_identifier): Observable<any> {
    /*
    Retrieve a Detailed Airports Object identified by the param "local_identifier"

    Args:
    ====
      + local_identifier
        - type: string.
        - max_lenght: 3.
        - min_lenght: 3.

    Return:
    ======
      + Object: see documentation: http://datos.anac.gob.ar/madhel/api/docs/#!/madhel/api_v2_airports_read
    */
    const endpoint = this.api_search + '/' + local_identifier;
    console.log(endpoint);
    return this.http.get(endpoint);
  }

  getAirportsList(): Observable<any> {
    /*
    Retrieve a list of Airports Objects"

    Args:
    ====
      + None

    Return:
    ======
      + Object: see documentation: http://datos.anac.gob.ar/madhel/api/docs/#!/madhel/api_v2_airports_list
    */
    console.log('GET:' + this.api_search + '.');
    return this.http.get(this.api_search);
  }

  getNearAirports(lat, lng, radius): Observable<any> {
    /*
    Retrieve a list of close Airports Object near to (@param: lat, @param: lng) inside a radius = @param: radius.

    Args:
    ====
      + lat
        - type: number.
        - max_value: 90.0.
        - min_value: -90.0.

      + lng
        - type: string
        - max_value: 180.0.
        - min_value: -180.0.

      + radius
        - type: string.
        - max_value: 0.
        - min_value: 120000.

    Return:
    ======
      + Object: see documentation: http://datos.anac.gob.ar/madhel/api/docs/#!/madhel/api_v2_airports_near_read
    */
    const endpoint = this.api_near + '/' + lat + '/'  + lng  + '/' + radius;
    console.log('GET:' + endpoint + '.');
    return this.http.get(endpoint);

  }

}
