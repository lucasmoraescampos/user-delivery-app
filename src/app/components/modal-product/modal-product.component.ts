import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { ObjectHelper } from 'src/app/helpers/object.helper';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss'],
})
export class ModalProductComponent implements OnInit {

  @Input() productOrderIndex: number;

  @Input() company: any;

  @Input() product: any;

  public selectedComplements: any[] = [];

  public note: string = '';

  public qty: number = 1;

  constructor(
    private modalCtrl: ModalController,
    private orderSrv: OrderService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    if (this.productOrderIndex !== undefined) {

      const order = ObjectHelper.clone(this.orderSrv.getCurrentOrder());

      this.selectedComplements = order.products[this.productOrderIndex].complements;

      this.note = order.products[this.productOrderIndex].note;

      this.qty = order.products[this.productOrderIndex].qty;

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

  public get checkRequiredComplements() {

    for (let i = 0; i < this.product.complements.length; i++) {

      let complement = this.product.complements[i];

      if (complement.required) {

        const selectedComplementIndex = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', complement.id);

        if (selectedComplementIndex != -1) {

          let qty = 0;

          this.selectedComplements[selectedComplementIndex].subcomplements.forEach((subcomplement: any) => {
            qty += subcomplement.qty;
          });

          if (qty < complement.qty_min) {

            return false;

          }

        }

        else {

          return false;

        }

      }

    }

    return true;

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public subcomplementQty(subcomplement: any) {

    const complementIndex = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', subcomplement.complement_id);

    if (complementIndex != -1) {

      const subcomplements = this.selectedComplements[complementIndex].subcomplements;

      const subcomplementIndex = ArrayHelper.getIndexByKey(subcomplements, 'id', subcomplement.id);

      if (subcomplementIndex != -1) {
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

    this.checkDisableAddComplement(subcomplement.complement_id);

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

    if (this.checkRequiredComplements) {
        
      const order = this.orderSrv.getCurrentOrder();

      if (order.company && order.company.id != this.company.id) {

        this.alertSrv.show({
          icon: 'warning',
          message: 'Você só pode adicionar itens de uma empresa por vez. Deseja esvaziar a sacola e adicionar este item?',
          confirmButtonText: 'Esvaziar sacola e adicionar',
          onConfirm: () => {

            this.orderSrv.clear();

            this.add();

          }
        });

      }

      else {

        if (order.company == null) {

          this.orderSrv.setCompany(this.company);

        }

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

    }

    else {

      this.alertSrv.show({
        icon: 'warning',
        message: 'É preciso escolher todos os itens obrigatórios antes de adicionar o produto à sacola.',
        confirmButtonText: 'Ok, entendi',
        showCancelButton: false
      });

    }

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

  private checkDisableAddComplement(id: number) {

    const selectedComplementIndex = ArrayHelper.getIndexByKey(this.selectedComplements, 'id', id);

    if (selectedComplementIndex != -1) {

      const complementIndex = ArrayHelper.getIndexByKey(this.product.complements, 'id', id);

      const buttons: NodeList = document.querySelectorAll(`.complement${id} ion-item ion-button:last-child`)

      let qty = 0;

      this.selectedComplements[selectedComplementIndex].subcomplements.forEach((subcomplement: any) => {
        qty += subcomplement.qty;
      });

      if (qty < this.product.complements[complementIndex].qty_max) {

        buttons.forEach((button: any) => {
          button.disabled = false;
        });

      }

      else {

        buttons.forEach((button: any) => {
          button.disabled = true;
        });

      }

    }

  }

}
