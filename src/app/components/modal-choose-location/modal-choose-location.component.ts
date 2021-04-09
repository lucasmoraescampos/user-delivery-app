import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalAuthComponent } from '../modal-auth/modal-auth.component';

const { Geolocation } = Plugins;

declare const google: any;

@Component({
  selector: 'app-modal-choose-location',
  templateUrl: './modal-choose-location.component.html',
  styleUrls: ['./modal-choose-location.component.scss'],
})
export class ModalChooseLocationComponent implements OnInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  @ViewChild(IonSlides) slides: IonSlides;

  @Input() allowClosing: boolean = true;

  public slideActiveIndex: number = 0;

  public currentLocation: any;

  public locations: any[];

  public loading: boolean;

  public authenticated: boolean;

  public search: string;

  public addresses: any[];

  public updateLocationId: number;

  public submitAttempt: boolean;

  public formGroup: FormGroup;

  private latLng: any;

  private marker: any;

  private map: any;

  private geocoder = new google.maps.Geocoder();

  private infoWindow = new google.maps.InfoWindow();

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  private unsubscribe = new Subject();

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private orderSrv: OrderService,
    private alertSrv: AlertService,
    private authSrv: AuthService,
    private locationSrv: LocationService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      postal_code: ['', Validators.required],
      street_name: ['', Validators.required],
      street_number: ['', Validators.required],
      district: ['', Validators.required],
      complement: [''],
      city: ['', Validators.required],
      uf: ['', Validators.required],
      country: ['', Validators.required],
      type: [null]
    });

    this.initLocations();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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

  public async modalAuth() {

    const modal = await this.modalCtrl.create({
      component: ModalAuthComponent,
      backdropDismiss: false
    });

    modal.onDidDismiss()
      .then(() => {
        this.initLocations();
      });

    return await modal.present();

  }

  public options(index: number) {

    const location = this.locations[index];

    this.alertSrv.options({
      title: `${location.street_name}, ${location.street_number}, ${location.district}, ${location.city} - ${location.uf}`,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          callback: () => {
            this.updateLocation(index);
          }
        },
        {
          text: 'Excluir',
          icon: 'trash-outline',
          callback: () => {
            this.deleteLocation(index);
          }
        }
      ]
    });

  }

  public selectLocation(location: any) {

    this.orderSrv.setLocation({
      id: location.id,
      street_name: location.street_name,
      street_number: location.street_number,
      complement: location.complement,
      district: location.district,
      city: location.city,
      uf: location.uf,
      postal_code: location.postal_code,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      type: location.type
    });

    this.modalCtrl.dismiss();

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

  public favorite(type: number) {
    if (this.formControl.type.value == type) {
      this.formGroup.patchValue({ type: null });
    }
    else {
      this.formGroup.patchValue({ type: type });
    }
  }

  public save() {

    this.submitAttempt = true;

    if (this.formGroup.valid) {

      this.loading = true;

      const location: any = this.formGroup.value;

      location.postal_code = location.postal_code.replace(/[^0-9]/g, '');

      location.latitude = this.latLng.lat;

      location.longitude = this.latLng.lng;

      if (this.updateLocationId) {

        this.locationSrv.update(this.updateLocationId, location)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.orderSrv.setLocation(location);

              this.slides.slideTo(0)
                .then(() => {

                  const index = ArrayHelper.getIndexByKey(this.locations, 'id', res.data.id);

                  this.locations[index] = res.data;

                });

            }

          });

      }

      else {

        this.locationSrv.create(location)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              location.id = res.data.id;

              this.orderSrv.setLocation(location);

              this.modalCtrl.dismiss();

            }

          });

      }

    }

  }

  private initLocations() {

    const user = this.authSrv.getCurrentUser();

    if (user) {

      this.authenticated = true;

      this.loading = true;

      this.locationSrv.getAll()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {
          this.loading = false;
          this.locations = res.data;
        });

      const order = this.orderSrv.getCurrentOrder();

      if (order) {
        this.currentLocation = order.location;
      }

    }

    else {

      this.authenticated = false;

    }

  }

  private async initMap(location?: any) {

    this.loading = true;

    try {

      if (location) {

        this.updateLocationId = location.id;

        this.latLng = {
          lat: location.latitude,
          lng: location.longitude
        };

        this.formGroup.patchValue({
          id: location.id,
          street_name: location.street_name,
          street_number: location.street_number,
          complement: location.complement,
          district: location.district,
          city: location.city,
          uf: location.uf,
          postal_code: location.postal_code,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          type: location.type
        });

        this.loading = false;

      }

      else {

        this.updateLocationId = null;

        const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

        this.latLng = {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude
        };

      }

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

      this.marker.addListener('dragend', (data: any) => {

        this.latLng = {
          lat: data.latLng.lat(),
          lng: data.latLng.lng()
        };

        this.map.setCenter(this.latLng);

        this.geocodeLatLng(this.latLng);

      });

      if (location == undefined) {

        this.geocodeLatLng(this.latLng);

      }

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

        this.formGroup.patchValue({ country: component.long_name });

      }

      else if (component.types.indexOf('postal_code') != -1) {

        this.formGroup.patchValue({ postal_code: component.short_name });

      }

    });

  }

  private updateLocation(index: number) {
    this.slideActiveIndex++;
    this.slides.slideNext();
    this.initMap(this.locations[index]);
  }

  private deleteLocation(index: number) {

    const location = this.locations[index];

    const address = `${location.street_name}, ${location.street_number}, ${location.district}, ${location.city} - ${location.uf}`;

    this.alertSrv.show({
      icon: 'warning',
      message: `Você está prestes a excluir o endereço "${address}"`,
      onConfirm: () => {

        this.loading = true;

        this.locationSrv.delete(this.locations[index].id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loading = false;

            if (res.success) {
              this.locations = ArrayHelper.removeItem(this.locations, index);
            }

          });

      }
    });

  }

}
