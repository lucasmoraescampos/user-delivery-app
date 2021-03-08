import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { OrderService } from 'src/app/services/order.service';
import { ModalAuthComponent } from '../modal-auth/modal-auth.component';
import { ModalChooseLocationComponent } from '../modal-choose-location/modal-choose-location.component';
import { ModalProductComponent } from '../modal-product/modal-product.component';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss'],
})
export class CurrentOrderComponent implements OnInit, OnDestroy {

  @Input() company: any;

  @Input() products: any[];

  public order: CurrentOrder;

  public subtotal: number = 0;

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.initOrder();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async chooseAddress() {
    const modal = await this.modalCtrl.create({
      component: ModalChooseLocationComponent,
      backdropDismiss: false
    });
    
    return await modal.present();
  }

  public async choosePaymentMethod() {
    if (!this.order.user_id) {
      
      const modal = await this.modalCtrl.create({
        component: ModalAuthComponent,
        backdropDismiss: false,
        cssClass: 'modal-sm'
      });
  
      modal.onDidDismiss()
        .then(res => {
          if (res.data) {
            this.choosePaymentMethod();
          }
        });
  
      modal.present();

    }
    else {

    }
  }

  public async edit(index: number) {

    const productOrder = this.order.products[index];

    const productIndex = ArrayHelper.getIndexByKey(this.products, 'id', productOrder.id);

    const modal = await this.modalCtrl.create({
      component: ModalProductComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        productOrderIndex: index,
        product: this.products[productIndex]
      }
    });

    return await modal.present();

  }

  public remove(index: number) {
    this.orderSrv.removeProductCurrentOrder(index);
  }

  private initOrder() {

    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {

        this.order = order;

        this.subtotal = 0;

        this.order.products.forEach((product: any) => {

          this.subtotal += product.price;

          product.complements.forEach((complement: any) => {

            complement.subcomplements.forEach((subcomplement: any) => {

              this.subtotal += (subcomplement.price * subcomplement.qty);
            
            });

          });

          this.subtotal *= product.qty;

        });

      });

  }

}