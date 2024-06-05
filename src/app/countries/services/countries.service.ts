import { Injectable } from '@angular/core';
import { Country, Region, smallCountry } from '../interfaces/country.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _regions: Region[] = [
    Region.africa,
    Region.america,
    Region.europe,
    Region.oceania,
    Region.asia,
    Region.antarctic,
  ];
  private baseUrl = `https://restcountries.com/v3.1/`;

  constructor(private http: HttpClient) {}

  get regions(): Region[] {
    return [...this._regions];
  }

  onRegionChange(region: Region): Observable<smallCountry[]> {
    console.log('REgion en servicio ', region);
    const url = `${this.baseUrl}region/${region}?fields=cca3,name,borders`;
    //`${this.baseUrl}region/${region}?fields=cca3,name,borders`;
    if (!region) {
      return of([]);
    }
    return this.http.get<Country[]>(url).pipe(
      tap((response) => console.log('response', response)),
      map((countries) =>
        countries.map((country) => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders || [],
        }))
      ),
      tap((response) => console.log('response Modified', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
        return of([]);
      })
    );
  }
}
