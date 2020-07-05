import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { UserService } from 'src/app/services/user/user.service';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  public loading: boolean = false;

  public order: any;

  public socket: WebSocketSubject<any>;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertSrv: AlertService,
    private toastSrv: ToastService
  ) { }

  ngOnInit() {

    this.prepareOrder();

    this.prepareSocket();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public company(id: number) {

    this.modalCtrl.dismiss();

    this.navCtrl.navigateForward('/products', {
      queryParams: {
        company: id
      }
    });

  }

  public total(a: number, b: number) {
    return Number(a) * Number(b);
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

                this.order.feedback = value;

              }

              else {

                this.toastSrv.error(res.message);

              }

            });

        }

      });

  }

  private prepareOrder() {

    this.loading = true;

    const id = this.navParams.get('order');

    this.orderSrv.getById(id)
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.order = res.data;

        }

      });

  }

  private prepareSocket() {

    const user_id = UserService.auth().id;

    this.socket = webSocket(`${ConfigHelper.Socket}/user/order?id=${user_id}`);

    this.socket.subscribe(data => {

      this.order.status = data.status;

      if (data.status == 4) {

        this.order.delivered_at = new Date();

      }

    });

  }
}
