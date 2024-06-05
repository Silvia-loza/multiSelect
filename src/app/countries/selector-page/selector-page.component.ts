import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../services/countries.service';
import { Region, smallCountry } from '../interfaces/country.interface';
import { switchMap } from 'rxjs';

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
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.myForm.get('region')?.valueChanges.subscribe((region) => {
      this.onRegionChange();
      console.log({ region });
    });
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange() {
    this.myForm
      .get('region')!
      .valueChanges.pipe(
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
}
