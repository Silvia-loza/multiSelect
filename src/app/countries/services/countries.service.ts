import { Injectable } from '@angular/core';
import { Country, Region, smallCountry } from '../interfaces/country.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  combineLatest,
  filter,
  map,
  of,
  tap,
} from 'rxjs';

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

  getCountryByAlphaCode(alphaCode: string): Observable<smallCountry> {
    const url = `${this.baseUrl}alpha/${alphaCode}`;
    return this.http.get<Country>(url).pipe(
      map((country: Country) => ({
        name: country?.name?.common || 'no hay name',
        cca3: country?.cca3 || 'no hay cca3',
        borders: country?.borders || ['no hay borders'],
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
        // Devuelve un objeto smallCountry con valores por defecto en caso de error
        return of({
          name: 'Error',
          cca3: 'Error',
          borders: ['Error'],
        });
      })
    );
  }

  getCountryBordersByCode(borders: string[]): Observable<smallCountry[]> {
    if (!borders) {
      return of([]);
    }
    const peticiones: Observable<smallCountry>[] = [];
    borders.forEach((codigo) => {
      const peticion = this.getCountryByAlphaCode(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }
}
