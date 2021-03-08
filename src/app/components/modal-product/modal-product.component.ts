import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss'],
})
export class ModalProductComponent implements OnInit {

  @Input() productOrderIndex: number;

  @Input() product: any;

  public selectedComplements: any[] = [];

  public note: string = '';

  public qty: number = 1;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService
  ) { }

  ngOnInit() {

    if (this.productOrderIndex !== undefined) {

      const productOrder = this.orderSrv.getCurrentOrder().products[this.productOrderIndex];

      this.selectedComplements = productOrder.complements;

      this.note = productOrder.note;

      this.qty = productOrder.qty;

    }

  }

  public get total() {

    let total = this.product.price - this.product.rebate;

    this.selectedComplements.forEach(complement => {
      complement.subcomplements.forEach((subcomplement: any) => {
        total += subcomplement.price * subcomplement.qty;
      });
    });

    return total * this.qty;

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public subcomplementQty(subcomplement: any) {

    const complementIndex = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', subcomplement.complement_id);

    if (complementIndex > -1) {

      const subcomplements = this.selectedComplements[complementIndex].subcomplements;
      
      const subcomplementIndex = ArrayHelper.getIndexByKey(subcomplements, 'id', subcomplement.id);

      if (subcomplementIndex > -1) {
        return subcomplements[subcomplementIndex].qty;
      }

      else {
        return 0;
      }

    }

    else {
      return 0;
    }

  }

  public changeQty(event: any) {
    this.qty = event.qty;
  }

  public changeSubcomplement(subcomplement: any, event: any) {

    const complementIndex = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', subcomplement.complement_id);

    if (event.qty > 0) {

      if (complementIndex == -1) {

        this.selectedComplements.push({
          id: subcomplement.complement_id,
          subcomplements: [{
            id: subcomplement.id,
            description: subcomplement.description,
            qty: event.qty,
            price: subcomplement.price
          }]
        });

      }

      else {

        const subcomplements = this.selectedComplements[complementIndex].subcomplements;

        const subcomplementIndex = ArrayHelper.getIndexByKey(subcomplements, 'id', subcomplement.id);

        if (subcomplementIndex == -1) {

          this.selectedComplements[complementIndex].subcomplements.push({
            id: subcomplement.id,
            description: subcomplement.description,
            qty: event.qty,
            price: subcomplement.price
          });

        }

        else {

          this.selectedComplements[complementIndex].subcomplements[subcomplementIndex].qty = event.qty;

        }

      }

    }

    else {

      const subcomplements = this.selectedComplements[complementIndex].subcomplements;

      const subcomplementIndex = ArrayHelper.getIndexByKey(subcomplements, 'id', subcomplement.id);

      this.selectedComplements[complementIndex].subcomplements = ArrayHelper.removeItem(subcomplements, subcomplementIndex);

      if (this.selectedComplements[complementIndex].subcomplements.length == 0) {

        this.selectedComplements = ArrayHelper.removeItem(this.selectedComplements, complementIndex);

      }

    }

  }

  public checkSubcomplement(complement: any, event: any) {

    const index = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', complement.id);

    this.selectedComplements = ArrayHelper.removeItem(this.selectedComplements, index);

    if (event.detail.value !== undefined) {

      this.selectedComplements.push({
        id: complement.id,
        subcomplements: [{
          id: event.detail.value.id,
          description: event.detail.value.description,
          qty: 1,
          price: event.detail.value.price
        }]
      });
      
    }

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
      image: this.product.image,
      complements: this.selectedComplements
    });

    this.modalCtrl.dismiss();

  }

  public update() {

    this.orderSrv.updateProductCurrentOrder(this.productOrderIndex, {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      rebate: this.product.rebate,
      qty: this.qty,
      note: this.note,
      image: this.product.image,
      complements: this.selectedComplements
    });

    this.modalCtrl.dismiss();

  }

}
