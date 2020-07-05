import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company/company.service';
import { LocationService } from '../../services/location/location.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SubcategoryService } from 'src/app/services/subcategory/subcategory.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {

  public companies: Array<any> = [];

  public products: Array<any> = [];

  public subcategory: any;

  public segment: number = 1;

  constructor(
    private route: ActivatedRoute,
    private companySrv: CompanyService,
    private productSrv: ProductService,
    private subcategorySrv: SubcategoryService,
    private loadingSrv: LoadingService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.prepareSubcategory();

    this.prepareCompanies();

    this.prepareProducts();

  }

  public company(company: any) {

    this.navCtrl.navigateForward('/products', {
      queryParams: {
        company: company.id
      }
    });

  }

  public product(product: any) {

    this.navCtrl.navigateForward('/products', {
      queryParams: {
        company: product.company_id,
        product: product.id
      }
    });

  }

  public refresh(event: any) {

    const subcategory_id = this.route.snapshot.queryParamMap.get('subcategory');

    this.companySrv.getBySubcategory(subcategory_id)
      .subscribe(res => {

        this.companies = [];

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          res.data.forEach(element => {

            const companyLatLng = {
              lat: element.latitude,
              lng: element.longitude
            };

            element.distance = LocationService.distance(userLatLng, companyLatLng);

            this.companies.push(element);

          });

        }

      });

    this.productSrv.getBySubcategory(subcategory_id)
      .subscribe(res => {

        this.products = [];

        event.target.complete();

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          res.data.forEach(element => {

            const companyLatLng = {
              lat: element.latitude,
              lng: element.longitude
            };

            element.distance = LocationService.distance(userLatLng, companyLatLng);

            this.products.push(element);

          });

        }

      });

  }

  public segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  private prepareSubcategory() {

    this.loadingSrv.show();

    const subcategory_id = this.route.snapshot.queryParamMap.get('subcategory');

    this.subcategorySrv.getById(subcategory_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.subcategory = res.data;
        }
      });
  }

  private prepareCompanies() {

    this.loadingSrv.show();

    const subcategory_id = this.route.snapshot.queryParamMap.get('subcategory');

    this.companySrv.getBySubcategory(subcategory_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          res.data.forEach(element => {

            const companyLatLng = {
              lat: element.latitude,
              lng: element.longitude
            };

            element.distance = LocationService.distance(userLatLng, companyLatLng);

            this.companies.push(element);

          });

        }

      });

  }

  private prepareProducts() {

    this.loadingSrv.show();

    const subcategory_id = this.route.snapshot.queryParamMap.get('subcategory');

    this.productSrv.getBySubcategory(subcategory_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          res.data.forEach(element => {

            const companyLatLng = {
              lat: element.latitude,
              lng: element.longitude
            };

            element.distance = LocationService.distance(userLatLng, companyLatLng);

            this.products.push(element);

          });

        }

      });

  }
}
