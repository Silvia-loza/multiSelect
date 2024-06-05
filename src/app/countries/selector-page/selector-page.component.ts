import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../services/countries.service';
import { Region, smallCountry } from '../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css',
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });
  countires = <smallCountry[]>[];
  borders = <smallCountry[]>[];
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange() {
    this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        switchMap((region) => this.countriesService.onRegionChange(region))
      )
      .subscribe(
        (countries) => {
          console.log('countries in onRegionChange ', { countries });
          this.countires = countries;
        },
        (error) => {
          console.error('Error in subscribe', error);
        }
      );
  }

  onCountryChange() {
    //const borders = this.myForm.get('borders')?.value;
    this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('borders')!.setValue('')),
        filter((value) => value.length > 0),
        switchMap((alfphaCode) =>
          this.countriesService.getCountryByAlphaCode(alfphaCode)
        ),
        switchMap((country) =>
          this.countriesService.getCountryBordersByCode(country.borders)
        )
      )
      .subscribe(
        (country) => {
          console.log('borders in onRegionChange ', { country });
          this.borders = country;
        },
        (error) => {
          console.error('Error in subscribe', error);
        }
      );
  }
}
