import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';

const { Geolocation } = Plugins;

declare const google: any;

@Component({
  selector: 'app-modal-choose-location',
  templateUrl: './modal-choose-location.component.html',
  styleUrls: ['./modal-choose-location.component.scss'],
})
export class ModalChooseLocationComponent implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  @ViewChild(IonSlides) slides: IonSlides;

  public slideActiveIndex: number = 0;

  public loading: boolean;

  public search: string;

  public addresses: any[];

  public submitAttempt: boolean;

  public formGroup: FormGroup;

  private latLng: any;

  private marker: any;

  private map: any;

  private geocoder = new google.maps.Geocoder();

  private infoWindow = new google.maps.InfoWindow();

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private orderSrv: OrderService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      postal_code: ['', Validators.required],
      street_name: ['', Validators.required],
      street_number: ['', Validators.required],
      district: ['', Validators.required],
      complement: [''],
      city: ['', Validators.required],
      uf: ['', Validators.required]
    });

  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async initMap() {
    
    this.loading = true;

    try {

      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

      this.latLng = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      const mapOptions = {
        center: this.latLng,
        zoom: 18,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: this.latLng
      });

      this.geocodeLatLng(this.latLng);

      this.marker.addListener('dragend', (data: any) => {

        this.latLng = {
          lat: data.latLng.lat(),
          lng: data.latLng.lng()
        };

        this.map.setCenter(this.latLng);

        this.geocodeLatLng(this.latLng);

      });

    } catch (error) {

      this.alertSrv.show({
        icon: 'error',
        message: 'Não foi possível obter localização, verifique se o seu GPS está ativado ou se o sistema possui permissão para acessar sua localização.',
        showCancelButton: false,
        onConfirm: () => {
          this.modalCtrl.dismiss();
        } 
      });

    }

  }

  public searchChanged() {

    if (this.search.trim().length < 3) {

      this.addresses = [];

    }

    else {

      const latLng = new google.maps.LatLng(this.latLng);

      this.googleAutocomplete.getPlacePredictions({
        input: this.search,
        location: latLng,
        radius: 10000
      }, (predictions: any) => {

        this.ngZone.run(() => {

          this.addresses = [];

          predictions.forEach((prediction: any) => {

            this.addresses.push(prediction.description);

          });

        });

      });

    }

  }

  public selectAddress(address: string) {

    this.search = address;

    this.addresses = [];

    this.geocodeAddress(address);

  }

  public async locate() {

    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    this.marker.setPosition(this.latLng);

    this.map.setCenter(this.latLng);

    this.geocodeLatLng(this.latLng);

  }

  public prev() {
    this.slideActiveIndex--;
    this.slides.slidePrev();
  }

  public next() {

    this.slideActiveIndex++;

    this.slides.slideNext();

    if (this.slideActiveIndex == 1 && this.map == undefined) {

      this.initMap();

    }

  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      this.orderSrv.setLocation(this.formGroup.value);

      this.loading = false;

      this.modalCtrl.dismiss();

    }

  }

  private geocodeLatLng(latLng: any) {

    this.loading = true;

    this.geocoder.geocode({ location: latLng }, (results: any) => {

      this.loading = false;

      this.serializeAddress(results[0].address_components);

      setTimeout(() => {

        this.infoWindow.setContent(results[0].formatted_address);

        this.infoWindow.open(this.map, this.marker);

      }, 500);

    });

  }

  private geocodeAddress(address: any) {

    this.loading = true;

    this.geocoder.geocode({ address: address }, (results: any) => {

      this.loading = false;

      this.latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      }

      this.marker.setPosition(this.latLng);

      this.map.setCenter(this.latLng);
  
      this.serializeAddress(results[0].address_components);

      setTimeout(() => {

        this.infoWindow.setContent(results[0].formatted_address);

        this.infoWindow.open(this.map, this.marker);

      }, 500);

    });

  }

  private serializeAddress(address_components: any[]) {

    address_components.forEach((component: any) => {

      if (component.types.indexOf('street_number') != -1) {

        this.formGroup.patchValue({ street_number: component.long_name });

      }

      else if (component.types.indexOf('route') != -1) {

        this.formGroup.patchValue({ street_name: component.long_name });

      }

      else if (component.types.indexOf('sublocality_level_1') != -1) {

        this.formGroup.patchValue({ district: component.long_name });

      }

      else if (component.types.indexOf('administrative_area_level_2') != -1) {

        this.formGroup.patchValue({ city: component.long_name });

      }

      else if (component.types.indexOf('administrative_area_level_1') != -1) {

        this.formGroup.patchValue({ uf: component.short_name });

      }

      else if (component.types.indexOf('country') != -1) {

      }

      else if (component.types.indexOf('postal_code') != -1) {

        this.formGroup.patchValue({ postal_code: component.short_name });

      }
      
    });

  }

}
