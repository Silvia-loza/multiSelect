import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interface';

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
  ];

  constructor() {}

  get regions(): Region[] {
    return [...this._regions];
  }
}
