import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {

  constructor(private http: HttpClient) { }

  getIncomeLevel(countryCode: string): Observable<any> {
    const apiUrl = `https://api.worldbank.org/v2/country/${countryCode}?format=json`;
    return this.http.get(apiUrl);
  }
}
