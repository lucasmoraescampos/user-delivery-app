import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeliveryLocation } from '../../models/DeliveryLocation';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { LocationService } from '../../services/location/location.service';
import { AddressPage } from 'src/app/pages/modals/address/address.page';
import { LatLng } from 'src/app/models/LatLng';
import { CartPage } from 'src/app/pages/modals/cart/cart.page';

declare var google: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;

  public search: string = '';

  public searchResults = new Array<any>();

  public currentLocation: DeliveryLocation;

  public deliveryLocation: DeliveryLocation;

  public loading: boolean = false;

  public spinner: boolean = false;

  public title: string;

  public subtitle: string;

  private map: any;

  private marker: any;

  private googleAutocomplete = new google.maps.places.AutocompleteService();

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private geolocation: Geolocation,
    private locationSrv: LocationService
  ) { }

  ngOnInit() {

    this.mapElement = this.mapElement.nativeElement;

    const location = this.route.snapshot.queryParamMap.get('location');

    this.loadMap(location);

  }

  public searchChanged() {

    if (this.search.trim().length < 3) return;

    this.spinner = true;

    const latLng = new google.maps.LatLng({
      lat: this.currentLocation.latLng.lat,
      lng: this.currentLocation.latLng.lng
    });

    this.googleAutocomplete.getPlacePredictions({
      input: this.search,
      location: latLng,
      radius: 10000
    }, predictions => {

      this.ngZone.run(() => {

        this.searchResults = [];

        if (predictions != null) {

          this.searchResults = LocationService.formatAddressForSearch(predictions);

        }

        this.spinner = false;

      });
    });

  }

  public selectLocation(location: any) {
    this.setDeliveryLocationByAddress(location);
  }

  public async continue() {

    const cart = this.route.snapshot.queryParamMap.get('cart') != null;

    const modal = await this.modalCtrl.create({
      component: AddressPage,
      cssClass: 'modal-custom',
      componentProps: {
        address: this.deliveryLocation.address,
        latLng: this.deliveryLocation.latLng,
        cart: cart
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          this.deliveryLocation = {
            user_location_id: res.data.id,
            address: {
              city: res.data.city,
              complement: res.data.complement,
              country: res.data.country,
              district: res.data.district,
              postal_code: res.data.postal_code,
              street_name: res.data.street_name,
              street_number: res.data.street_number,
              uf: res.data.uf
            },
            latLng: {
              lat: res.data.latitude,
              lng: res.data.longitude
            }
          };

          this.locationSrv.setDeliveryLocation(this.deliveryLocation);

          this.redirect();

        }

      });

    return await modal.present();

  }

  private async redirect() {

    const cart = this.route.snapshot.queryParamMap.get('cart');

    if (cart) {

      const modal = await this.modalCtrl.create({
        component: CartPage,
        cssClass: 'modal-custom'
      });

      await this.navCtrl.pop();

      await this.navCtrl.pop();

      return await modal.present();

    }

    else {

      this.navCtrl.navigateRoot('/tabs/home');

    }

  }

  private loadMap(location: any = null) {

    this.loading = true;

    if (location == null) {

      this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
        .then(position => {

          this.spinner = true;

          let latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.setDeliveryLocationByLatLng(latLng);

          this.setMap(latLng);

        });

    }

    else {

      this.locationSrv.getById(location)
        .subscribe(res => {

          if (res.success) {

            const address = {
              id: res.data.id,
              city: res.data.city,
              complement: res.data.complement,
              country: res.data.country,
              district: res.data.district,
              postal_code: res.data.postal_code,
              street_name: res.data.street_name,
              street_number: res.data.street_number,
              uf: res.data.uf,
              type: res.data.type
            };

            const latLng = {
              lat: Number(res.data.latitude),
              lng: Number(res.data.longitude)
            };

            this.deliveryLocation = {
              address: address,
              latLng: latLng
            };

            this.title = `${address.street_name}, ${address.street_number}`;

            this.subtitle = `${address.city} - ${address.uf}, ${address.country}`;

            this.setMap(latLng);

          }

        });

    }

  }

  private setMap(latLng: LatLng) {

    const mapOptions = {
      zoom: 18,
      center: latLng,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    this.marker.addListener('dragstart', () => {
      this.spinner = true;
    });

    this.marker.addListener('dragend', data => {

      this.spinner = false;

      const latLng = {
        lat: data.latLng.lat(),
        lng: data.latLng.lng()
      };

      this.map.setZoom(18);

      this.map.setCenter(latLng);

      this.setDeliveryLocationByLatLng(latLng);

    });

    this.spinner = false;

    this.loading = false;

  }

  private setDeliveryLocationByLatLng(latLng: any) {

    this.spinner = true;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, async geocode => {

      geocode = Array.isArray(geocode) ? geocode[0] : geocode;

      const address: any = {};

      geocode.address_components.forEach(component => {

        component.types.forEach(type => {

          switch (type) {

            case 'sublocality_level_1':

              address.district = component.long_name;

              break;

            case 'street_number':

              address.street_number = component.long_name;

              break;

            case 'route':

              address.street_name = component.long_name;

              break;

            case 'administrative_area_level_2':

              address.city = component.long_name;

              break;

            case 'administrative_area_level_1':

              address.uf = component.short_name;

              break;

            case 'country':

              address.country = component.long_name;

              break;

            case 'postal_code':

              address.postal_code = component.long_name;

              break;

          }

        });

      });

      this.deliveryLocation = {
        address: address,
        latLng: latLng
      };

      if (this.currentLocation == undefined) {

        this.currentLocation = this.deliveryLocation;

      }

      if (address.street_name != undefined) {

        this.title = address.street_name;
        this.title += address.street_number != undefined ? `, ${address.street_number}` : '';

        this.subtitle = `${address.city} - ${address.uf}, ${address.country}`;

      }

      else {

        this.title = `${address.city} - ${address.uf}`;

        this.subtitle = `${address.postal_code}, ${address.country}`;

      }

      this.spinner = false;

    });

  }

  private setDeliveryLocationByAddress(location: any) {

    this.spinner = true;

    let description = location.title;

    description += location.subtitle != null ? ', ' + location.subtitle : '';

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: description }, geocode => {

      geocode = Array.isArray(geocode) ? geocode[0] : geocode;

      const address: any = {};

      geocode.address_components.forEach(component => {

        component.types.forEach(type => {

          switch (type) {

            case 'sublocality_level_1':

              address.district = component.long_name;

              break;

            case 'street_number':

              address.street_number = component.long_name;

              break;

            case 'route':

              address.street_name = component.long_name;

              break;

            case 'administrative_area_level_2':

              address.city = component.long_name;

              break;

            case 'administrative_area_level_1':

              address.uf = component.short_name;

              break;

            case 'country':

              address.country = component.long_name;

              break;

            case 'postal_code':

              address.postal_code = component.long_name;

              break;

          }

        });

      });

      const latLng = {
        lat: geocode.geometry.location.lat(),
        lng: geocode.geometry.location.lng()
      }

      this.deliveryLocation = {
        address: address,
        latLng: latLng
      };

      if (address.street_name != undefined) {

        this.title = address.street_name;
        this.title += address.street_number != undefined ? `, ${address.street_number}` : '';

        this.subtitle = `${address.city} - ${address.uf}, ${address.country}`;

      }

      else {

        this.title = `${address.city} - ${address.uf}`;

        this.subtitle = `${address.postal_code}, ${address.country}`;

      }

      this.marker.setPosition(latLng);

      this.map.setCenter(latLng);

    });

    this.searchResults = [];

    this.spinner = false;
  }
}