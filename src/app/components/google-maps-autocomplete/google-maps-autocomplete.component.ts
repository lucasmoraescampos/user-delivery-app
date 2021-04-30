import { Component, Input, NgZone, OnInit, Output, EventEmitter } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-google-maps-autocomplete',
  templateUrl: './google-maps-autocomplete.component.html',
  styleUrls: ['./google-maps-autocomplete.component.scss'],
})
export class GoogleMapsAutocompleteComponent implements OnInit {

  @Input() latLng: any;

  @Output() changed = new EventEmitter();

  public loading: boolean;

  public search: string;

  public list: any[];

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  private geocoder = new google.maps.Geocoder();

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() {}

  public searchChanged() {

    this.changed.emit(null);

    if (this.search.trim().length < 3) {

      this.list = [];

    }

    else {

      this.googleAutocomplete.getPlacePredictions({
        input: this.search,
        location: this.latLng,
        radius: 10000
      }, (predictions: any) => {

        this.ngZone.run(() => {

          this.list = [];

          predictions.forEach((prediction: any) => {

            this.list.push(prediction.description);

          });

        });

      });

    }

  }

  public select(address: string) {

    this.loading = true;

    this.search = address;

    this.list = [];

    this.search = '';

    this.geocoder.geocode({ address: address }, (results: any) => {

      this.loading = false;

      this.changed.emit({
        location: results[0].geometry.location,
        formatted_address: address,
        address_components: results[0].address_components
      });

    });

  }

}
