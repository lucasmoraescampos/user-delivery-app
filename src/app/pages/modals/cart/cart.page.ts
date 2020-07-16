import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocationService } from 'src/app/services/location/location.service';
import { UserService } from 'src/app/services/user/user.service';
import { PaymentMethodPage } from '../payment-method/payment-method.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public loading: boolean = false;

  public order: any;

  public products: any;

  public subtotal: number = 0;

  public total: number = 0;

  public company: any;

  public location: any;

  public address: string;

  public payment_method: any;

  public spinner: boolean = false;

  private socket: WebSocketSubject<any>;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private companySrv: CompanyService,
    private alertSrv: AlertService,
    private navCtrl: NavController,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {

    this.orderSrv.currentOrder.subscribe(order => {
      this.order = order;
    });

    this.products = OrderService.productDetails();

    this.prepareSubtotal();

    this.prepareCompany();

    this.prepareLocation();

    this.preparePaymentMethod();

    this.prepareSocket();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async selectPaymentMethod() {

    const modal = await this.modalCtrl.create({
      component: PaymentMethodPage,
      cssClass: 'modal-custom',
      componentProps: {
        accept_payment_app: this.company.accept_payment_app,
        payment_methods: this.company.payment_methods,
        total: this.total
      }
    });

    modal.onWillDismiss()
      .then(res => {

        this.preparePaymentMethod();

      });

    return await modal.present();

  }

  public emptyCart() {

    this.alertSrv.confirm('Esvaziar Carrinho', 'Tem certeza de que deseja esvaziar seu carrinho?')
      .then(res => {

        if (res.isConfirmed) {

          this.orderSrv.remove();

          this.modalCtrl.dismiss();

        }

      });

  }

  public doOrder() {

    if (this.subtotal < this.company.min_value) {

      const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.company.min_value);

      this.toastSrv.error(`O pedido mínimo para esta loja é de ${value}, não inclusa a taxa de entrega!`);

      return;

    }

    this.spinner = true;

    const order = OrderService.getCurrentOrder();

    const location = LocationService.getDeliveryLocation();

    order.address = `${location.address.street_name}, ${location.address.street_number},`;

    if (location.address.complement) {

      order.address += ` ${location.address.complement},`;

    }

    order.address += ` ${location.address.city} - ${location.address.uf}`;

    order.latitude = location.latLng.lat;

    order.longitude = location.latLng.lng;

    order.payment_type = this.payment_method.type;

    if (this.payment_method.type == 1) {

      order.payment_method_id = this.payment_method.payment_method;

      order.card_token = this.payment_method.token;

      order.card_number = this.payment_method.number;

      order.card_holder_name = this.payment_method.holder_name;

    }

    else {

      order.payment_method_id = this.payment_method.id;

      order.cashback = this.payment_method.cashback;

    }

    this.orderSrv.create(order)
      .subscribe(res => {

        this.spinner = false;

        if (res.success) {

          this.orderSrv.remove();

          this.navCtrl.navigateRoot('/tabs/orders', {
            queryParams: {
              refresh: true
            }
          });

          this.sendOrder(res.data);

          this.modalCtrl.dismiss();

        }

        else {

          this.toastSrv.error(res.message);

        }

      });

  }

  public locations() {

    this.navCtrl.navigateForward('locations', {
      queryParams: {
        btnBack: true,
        cart: true
      }
    });

    this.modalCtrl.dismiss();

  }

  public addItems() {

    const order = OrderService.getCurrentOrder();

    this.navCtrl.navigateForward('/products', {
      queryParams: {
        company: order.company_id
      }
    });

    this.modalCtrl.dismiss();

  }

  private prepareSubtotal() {

    this.products.forEach(product => {
      this.subtotal += product.price;
    });

  }

  private prepareCompany() {

    this.loading = true;

    this.companySrv.getById(this.order.company_id)
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.company = res.data;

          this.total = this.subtotal + this.company.delivery_price;

        }

      });

  }

  private prepareLocation() {

    this.location = LocationService.getDeliveryLocation();

    if (this.location.address.type != null) {

      if (this.location.address.complement != null) {

        this.address = `${this.location.address.street_name}, ${this.location.address.street_number} - ${this.location.address.district}, ${this.location.address.city}, ${this.location.address.complement}`;

      }

      else {

        this.address = `${this.location.address.street_name}, ${this.location.address.street_number} - ${this.location.address.district}, ${this.location.address.city}`;

      }

    }

    else {

      if (this.location.address.complement != null) {

        this.address = `${this.location.address.district}, ${this.location.address.city}, ${this.location.address.complement}`;

      }

      else {

        this.address = `${this.location.address.district}, ${this.location.address.city}`;

      }

    }

  }

  private preparePaymentMethod() {

    this.payment_method = UserService.currentPaymentMethod();

  }

  private prepareSocket() {

    const user = UserService.auth();

    this.socket = webSocket(`${ConfigHelper.Socket}/user/order?id=${user.id}`);

    this.socket.subscribe();
    
  }

  private sendOrder(order: any) {

    const user = UserService.auth();

    order.user_name = user.name;

    order.user_surname = user.surname;

    this.socket.next(order);

  }

}
