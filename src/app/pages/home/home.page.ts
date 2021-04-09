import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalChooseLocationComponent } from 'src/app/components/modal-choose-location/modal-choose-location.component';
import { CurrentOrder } from 'src/app/models/current-order.model';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public order: CurrentOrder;

  public categories: any[];

  public categorySlideOptions = {
    loop: true,
    slidesPerView: 2,
    spaceBetween: 16,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 3,
        spaceBetween: 16
      },
      // when window width is >= 1024px
      576: {
        slidesPerView: 4,
        spaceBetween: 16
      },
      // when window width is >= 1024px
      768: {
        slidesPerView: 6,
        spaceBetween: 16
      },
      // when window width is >= 1024px
      992: {
        slidesPerView: 7,
        spaceBetween: 16
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 8,
        spaceBetween: 16
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 9,
        spaceBetween: 16
      }
    }
  }

  public companiesSlideOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 1024px
      768: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      // when window width is >= 1200px
      1200: {
        slidesPerView: 3,
        spaceBetween: 16
      }
    }
  }

  private unsubscribe = new Subject();

  constructor(
    private loadingSrv: LoadingService,
    private apiSrv: ApiService,
    private orderSrv: OrderService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.initCompanies();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewDidEnter() {
    this.requestLocation();
  }

  public openCompany(slug: string) {
    this.navCtrl.navigateForward(`/${slug}`);
  }

  private async requestLocation() {

    if (!this.order.location) {

      const modal = await this.modalCtrl.create({
        component: ModalChooseLocationComponent,
        backdropDismiss: false,
        componentProps: {
          allowClosing: false
        }
      });

      return await modal.present();

    }

  }

  private initCompanies() {

    this.orderSrv.currentOrder.pipe(takeUntil(this.unsubscribe))
      .subscribe(order => {

        this.order = order;

        if (this.order.location) {

          this.loadingSrv.show();

          this.apiSrv.getCompaniesByAllCategories(this.order.location.latitude, this.order.location.longitude)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(res => {
              this.loadingSrv.hide();
              this.categories = res.data
            });

        }

      });

  }

}
