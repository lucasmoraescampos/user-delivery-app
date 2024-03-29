import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListProfileComponent } from 'src/app/components/list-profile/list-profile.component';
import { ModalAuthComponent } from 'src/app/components/modal-auth/modal-auth.component';
import { ModalChooseLocationComponent } from 'src/app/components/modal-choose-location/modal-choose-location.component';
import { ModalProductComponent } from 'src/app/components/modal-product/modal-product.component';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit, OnDestroy {

  public bannerDefault: string;

  public company: any;

  public user: any;

  public menu: any;

  public order: CurrentOrder;

  public products: any[] = [];

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertSrv: AlertService,
    private loadingSrv: LoadingService,
    private apiSrv: ApiService,
    private route: ActivatedRoute,
    private orderSrv: OrderService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {

    this.initCompany();

    this.initOrder();

    this.initUser();

    this.bannerDefault = environment.imagesUrl + '/banner.png';

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public segmentChanged(event: any) {

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

  public async profile(event: any) {

    const modal = await this.popoverCtrl.create({
      component: ListProfileComponent,
      cssClass: 'popover-profile',
      event: event
    });
  
    return await modal.present();
    
  }

  public async modalProduct(product: any) {

    const modal = await this.modalCtrl.create({
      component: ModalProductComponent,
      backdropDismiss: false,
      cssClass: 'modal-lg',
      componentProps: {
        company: this.company,
        product: product
      }
    });

    return await modal.present();

  }

  private initCompany() {

    this.loadingSrv.show();

    const slug = this.route.snapshot.paramMap.get('slug');

    this.apiSrv.getCompanyBySlug(slug)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        
        this.loadingSrv.hide();

        if (res.success) {

          this.company = res.data.company;

          this.menu = res.data.menu;

          this.menu.forEach((category: any) => {
            category.products.forEach((product: any) => {
              this.products.push(product);
            });
          });

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
