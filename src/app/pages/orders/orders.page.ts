import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ModalController, NavController } from '@ionic/angular';
import { OrderDetailsPage } from '../modals/order-details/order-details.page';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { UserService } from 'src/app/services/user/user.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public loading: boolean = true;

  public current_orders: Array<any>;

  public previous_orders: Array<any>;

  public segment: string = 'previous';

  public socket: WebSocketSubject<any>;

  constructor(
    private orderSrv: OrderService,
    private loadingSrv: LoadingService,
    private modalCtrl: ModalController,
    private toastSrv: ToastService,
    private alertSrv: AlertService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.prepareOrders();

    this.prepareSocket();

  }

  ionViewWillEnter() {

    if (this.route.snapshot.queryParamMap.get('refresh')) {

      this.prepareOrders();

      this.navCtrl.navigateRoot([]);

    }

  }

  public async details(id: number) {

    const modal = await this.modalCtrl.create({
      component: OrderDetailsPage,
      cssClass: 'modal-custom',
      componentProps: {
        order: id
      }
    });

    return await modal.present();

  }

  public segmentChanged(event: CustomEvent) {
    this.segment = event.detail.value;
  }

  public feedback(id: number, value: number) {

    this.alertSrv.confirmFeedback(value)
      .then(res => {

        if (res.isConfirmed) {

          const feedback = {
            feedback: value
          };

          this.orderSrv.update(id, feedback)
            .subscribe(res => {

              if (res.success) {

                const index = ArrayHelper.getIndexByKey(this.previous_orders, 'id', id);

                this.previous_orders[index].feedback = value;

              }

              else {

                this.toastSrv.error(res.message);

              }

            });

        }

      });

  }

  public confirmDelivery(id: number) {

    this.alertSrv.confirm('Confirmar Entrega', `Confirmar a entrega do pedido Nº ${id}`)
      .then(res => {

        if (res.isConfirmed) {

          const order = {
            delivered: true
          };

          this.orderSrv.update(id, order)
            .subscribe(res => {

              if (res.success) {

                const index = ArrayHelper.getIndexByKey(this.current_orders, 'id', id);

                this.current_orders[index].status = 4;

                this.previous_orders.unshift(this.current_orders[index]);

                this.current_orders = ArrayHelper.RemoveItem(this.current_orders, index);

                this.segment = this.current_orders.length > 0 ? this.segment : 'previous';

              }

              else {

                this.toastSrv.error(res.message);

              }

            });

        }

      });

  }

  private prepareOrders() {

    this.loadingSrv.show();

    this.orderSrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        this.loading = false;

        this.current_orders = [];

        this.previous_orders = [];

        if (res.success) {

          res.data.forEach((order: any) => {

            if (order.status < 4) {

              this.segment = 'current';

              this.current_orders.push(order);

            }

            else {

              this.previous_orders.push(order);

            }

          });

        }

      });

  }

  private prepareSocket() {

    const user_id = UserService.auth().id;

    this.socket = webSocket(`${ConfigHelper.Socket}/user/order?id=${user_id}`);

    this.socket.subscribe(data => {

      const index = ArrayHelper.getIndexByKey(this.current_orders, 'id', data.order_id);

      this.current_orders[index].status = data.status;

      if (data.status == 4) {

        this.current_orders[index].delivered_at = new Date();

        this.previous_orders.unshift(this.current_orders[index]);

        this.current_orders = ArrayHelper.RemoveItem(this.current_orders, index);

        this.segment = this.current_orders.length > 0 ? this.segment : 'previous';

      }

    });

  }
}
