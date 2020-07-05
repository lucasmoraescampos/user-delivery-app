import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartPage } from 'src/app/pages/modals/cart/cart.page';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-button-cart',
  templateUrl: './button-cart.component.html',
  styleUrls: ['./button-cart.component.scss'],
})
export class ButtonCartComponent implements OnInit {

  public status: boolean;

  public total_price: number;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService
  ) { }

  ngOnInit() {

    this.orderSrv.currentOrder.subscribe(order => {

      this.status = order != null;

      if (this.status) {

        this.total_price = this.orderSrv.getTotalPrice();

      }

    });

  }

  public async cart() {

    const modal = await this.modalCtrl.create({
      component: CartPage,
      cssClass: 'modal-custom'
    });

    return await modal.present();

  }

}
