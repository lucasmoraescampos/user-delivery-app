import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location/location.service';
import { LocationOptionsPage } from '../popovers/location-options/location-options.page';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CartPage } from 'src/app/pages/modals/cart/cart.page';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  public btnBack: any;

  public user_location_id: any;

  public locations: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    private locationSrv: LocationService,
    private popoverCtrl: PopoverController,
    private toastSrv: ToastService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.btnBack = this.route.snapshot.queryParamMap.get('btnBack');

    this.prepareLocations();

  }

  public async cart() {

    const cart = this.route.snapshot.queryParamMap.get('cart');

    if (cart) {

      const modal = await this.modalCtrl.create({
        component: CartPage,
        cssClass: 'modal-custom'
      });

      return await modal.present();

    }

  }

  public add() {

    const cart = this.route.snapshot.queryParamMap.get('cart') != null;

    this.navCtrl.navigateForward('location', {
      queryParams: {
        cart: cart
      }
    });

  }

  public async options(ev: any, location: any) {

    const popover = await this.popoverCtrl.create({
      component: LocationOptionsPage,
      event: ev,
      translucent: true,
      mode: 'ios'
    });

    popover.onWillDismiss()
      .then(res => {

        if (res.data == 'change') {

          this.change(location);

        }

        else if (res.data == 'delete') {

          this.delete(location);

        }

      });

    return await popover.present();
  }

  private change(location: any) {

    this.navCtrl.navigateForward('location', {
      queryParams: {
        btnBack: true,
        location: location.id
      }
    });

  }

  private delete(location: any) {

    if (location.id != this.locationSrv.getDeliveryLocation().user_location_id) {

      this.locationSrv.delete(location.id)
        .subscribe(res => {

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.locations, 'id', location.id);

            this.locations = ArrayHelper.RemoveItem(this.locations, index);

          }

        });

    }

    else {

      this.toastSrv.error('Você não pode excluir o endereço que está usando no momento!');

    }

  }

  public select(location: any) {

    this.locationSrv.setDeliveryLocation({
      user_location_id: location.id,
      address: {
        street_number: location.street_number,
        street_name: location.street_name,
        complement: location.complement,
        district: location.district,
        city: location.city,
        uf: location.uf,
        country: location.country,
        postal_code: location.postal_code,
      },
      latLng: {
        lat: location.latitude,
        lng: location.longitude
      }
    });

    this.cart();

    this.navCtrl.navigateRoot('tabs/home');

  }

  private prepareLocations() {

    this.loadingSrv.show();

    this.locationSrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          if (res.data.length > 0) {

            const delivery_location = this.locationSrv.getDeliveryLocation();

            if (delivery_location != null) {

              this.user_location_id = delivery_location.user_location_id;

              this.locations[0] = null;

              res.data.forEach(location => {

                if (location.id == this.user_location_id) {

                  this.locations[0] = location;

                }

                else {

                  this.locations.push(location);

                }

              });

            }

            else {

              this.locations = res.data;

            }

          }

        }

      });
  }
}
