import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionType, Plugins } from '@capacitor/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { ModalAuthComponent } from '../modal-auth/modal-auth.component';

const { Geolocation, Permissions } = Plugins;

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

  public permissionState: 0 | 1 | 2;

  public slideActiveIndex: number = 0;

  public currentLocation: any;

  public locations: any[];

  public loading: boolean;

  public authenticated: boolean;

  public addresses: any[];

  public updateLocationId: number;

  public submitAttempt: boolean;

  public formGroup: FormGroup;

  public latLng: any;

  private marker: any;

  private map: any;

  private geocoder = new google.maps.Geocoder();

  private infoWindow = new google.maps.InfoWindow();

  private unsubscribe = new Subject();

  constructor(
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

    this.initPermissionState();

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

  public autocompleteChanged(event: any) {

    if (event) {

      this.latLng = event.location;

      this.marker.setPosition(this.latLng);

      this.map.panTo(this.latLng);

      this.serializeAddress(event.address_components);

      this.infoWindow.setContent(event.formatted_address);

    }

  }

  public async locate() {

    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

    this.latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    this.marker.setPosition(this.latLng);

    this.map.panTo(this.latLng);

    this.geocodeLatLng(this.latLng);

  }

  public prev() {
    this.slideActiveIndex--;
    this.slides.slidePrev();
  }

  public next() {

    if (this.slideActiveIndex == 0) {

      if (this.permissionState == 0) {

        this.alertSrv.custom({
          imageUrl: './assets/icon/place.svg',
          title: 'Permitir localização',
          message: 'Para descobrir empresas que entregam na sua região',
          confirmButtonText: 'Permitir',
          onConfirm: () => {
            Geolocation.getCurrentPosition({ enableHighAccuracy: true })
              .then(coordinates => {
                this.latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
                this.initMap();
                this.slideActiveIndex++;
                this.slides.slideNext();
                this.permissionState = 1;
              })
              .catch(() => {
                this.permissionState = 2;
              });
          }
        });

      }

      else if (this.permissionState == 2) {

        this.alertSrv.custom({
          imageUrl: './assets/icon/ban-location.svg',
          title: 'Não temos acesso à sua localização',
          message: 'Você pode mudar o acesso à sua localização nos ajustes do seu dispositivo',
          confirmButtonText: 'Entendi'
        });

      }

      else {

        this.slideActiveIndex++;

        this.slides.slideNext();

        this.map.panTo(this.latLng);

      }

    }

    else {

      this.slideActiveIndex++;

      this.slides.slideNext();

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

      location.latitude = this.latLng.lat();

      location.longitude = this.latLng.lng();

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

      else if (this.authSrv.isLoggedIn()) {

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

      else {

        this.selectLocation(location);

      }

    }

  }

  private geocodeLatLng(latLng: any) {

    this.geocoder.geocode({ location: latLng }, (results: any) => {

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

  private initPermissionState() {
    Permissions.query({ name: PermissionType.Geolocation })
      .then(res => {
        if (res.state == 'prompt') {
          this.permissionState = 0;
        }
        else if (res.state == 'denied') {
          this.permissionState = 2;
        }
        else {
          this.permissionState = 1;
          Geolocation.getCurrentPosition({ enableHighAccuracy: true })
              .then(coordinates => {
                this.latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
                this.initMap();
            });
        }
      });
  }

  private async initMap(location?: any) {

    try {

      if (location) {

        this.updateLocationId = location.id;

        this.latLng = new google.maps.LatLng(location.latitude, location.longitude);

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

      }

      else {

        this.updateLocationId = null;

      }

      const mapOptions = {
        center: this.latLng,
        zoom: 17,
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

        this.latLng = data.latLng;

        this.map.panTo(this.latLng);

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

  private initLocations() {

    this.loading = true;

    this.locations = [];

    const order = this.orderSrv.getCurrentOrder();

    if (order) {
      this.currentLocation = order.location;
    }

    if (this.authSrv.isLoggedIn()) {

      this.authenticated = true;

      this.locationSrv.getAll()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(res => {
          this.loading = false;
          this.locations = res.data;
        });

    }

    else {

      this.loading = false;
      
      this.authenticated = false;

      if (order.location) {

        this.locations.push(order.location);

      }

    }

  }

}
