import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss'],
})
export class ModalProductComponent implements OnInit {

  public product: any;

  public isEdit: boolean;

  public note: string;

  public qty: number;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private orderSrv: OrderService
  ) { }

  ngOnInit() {

    this.product = this.navParams.get('product');

    this.isEdit = this.navParams.get('isEdit');

    if (this.isEdit) {

      this.qty = this.product.qty;

      this.note = this.product.note;

    }

    else {

      this.qty =1;

      this.note = '';

    }

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeQty(ev: any) {
    this.qty = ev.qty;
  }

  public add() {
    this.orderSrv.addProductCurrentOrder({
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      rebate: this.product.rebate,
      qty: this.qty,
      note: this.note,
      image: this.product.image
    });

    this.modalCtrl.dismiss();
  }

  public update() {
    this.modalCtrl.dismiss({
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      rebate: this.product.rebate,
      qty: this.qty,
      note: this.note,
      image: this.product.image
    });
  }

}
