import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalAuthComponent } from 'src/app/components/modal-auth/modal-auth.component';
import { ModalChooseLocationComponent } from 'src/app/components/modal-choose-location/modal-choose-location.component';
import { ModalProductComponent } from 'src/app/components/modal-product/modal-product.component';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public company: any;

  public user: any;

  public menu: any;

  public order: CurrentOrder;

  public products = [1,1,1,1,1,1];

  public unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    private companySrv: CompanyService,
    private route: ActivatedRoute,
    private orderSrv: OrderService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {

    this.initCompany();

    this.initOrder();

    this.initUser();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public segmentChanged() {

  }

  public async location() {

    const modal = await this.modalCtrl.create({
      component: ModalChooseLocationComponent,
      backdropDismiss: false
    });

    return await modal.present();

  }

  public async signin() {

    const modal = await this.modalCtrl.create({
      component: ModalAuthComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm'
    });
  
    return await modal.present();
    
  }

  public async modalProduct(product: any) {

    const modal = await this.modalCtrl.create({
      component: ModalProductComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        product: product
      }
    });

    return await modal.present();

  }

  private initCompany() {

    this.loadingSrv.show();

    const slug = this.route.snapshot.paramMap.get('slug');

    this.companySrv.getBySlug(slug)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        
        this.loadingSrv.hide();

        if (res.success) {

          this.company = res.data.company;

          this.menu = res.data.menu;

        }

      });

  }

  private initOrder() {
    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {
        this.order = order;
      });
  }

  private initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.user = user;
      });
  }
}
