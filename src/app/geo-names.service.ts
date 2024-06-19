import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoNamesService {

  constructor(private http: HttpClient) { }

  getCountryDetails(countryCode: string): Observable<any> {
    const apiUrl = `https://secure.geonames.org/countryInfoJSON?country=${countryCode}&username=x21824`;
    return this.http.get(apiUrl);
  }
}
