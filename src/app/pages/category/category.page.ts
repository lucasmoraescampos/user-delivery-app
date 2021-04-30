import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit, OnDestroy {

  public category: any;

  public companies: any[];

  private unsubscribe = new Subject();

  constructor(
    private orderSrv: OrderService,
    private loadingSrv: LoadingService,
    private apiSrv: ApiService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initCompaniesByCategory();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public openCompany(slug: string) {
    this.navCtrl.navigateForward(`/${slug}`);
  }

  private initCompaniesByCategory() {

    const slug = this.route.snapshot.paramMap.get('slug');

    const order = this.orderSrv.getCurrentOrder();

    this.loadingSrv.show();

    this.apiSrv.getCompaniesByCategory(order.location.latitude, order.location.longitude, slug, 10, 0)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        this.category = res.data.category;
        this.companies = res.data.companies;
      });

  }

}
