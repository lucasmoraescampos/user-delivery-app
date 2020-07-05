import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/company/company.service';
import { LocationService } from '../../services/location/location.service';
import { LoadingService } from '../../services/loading/loading.service';
import { SubcategoryService } from 'src/app/services/subcategory/subcategory.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  public address: string;

  public companies: Array<any> = [];

  public subcategories: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private companySrv: CompanyService,
    private subcategorySrv: SubcategoryService,
    private locationSrv: LocationService,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.prepareAddress();

    this.prepareSubcategories();

    this.prepareCompanies();

  }

  public refresh(event: any) {

    const category_id = this.route.snapshot.queryParamMap.get('category');

    this.companySrv.getByCategory(category_id)
      .subscribe(res => {

        event.target.complete();

        if (res.success) {

          this.companies = [];

          const userLatLng = this.locationSrv.getDeliveryLocation().latLng;

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

    this.subcategorySrv.get(category_id)
      .subscribe(res => {

        if (res.success) {
          this.subcategories = res.data;
        }
      });
  }

  public location() {
    this.navCtrl.navigateForward('/locations', {
      queryParams: {
        btnBack: true
      }
    })
  }

  public products(company_id: number) {
    this.navCtrl.navigateForward('products', {
      queryParams: {
        company: company_id
      }
    });
  }

  public subcategory(subcategory_id: string) {

    const category_id = this.route.snapshot.queryParamMap.get('category');

    this.navCtrl.navigateForward('/subcategory', {
      queryParams: {
        category: category_id,
        subcategory: subcategory_id
      }
    });
  }

  private prepareAddress() {

    this.locationSrv.deliveryLocation.subscribe(location => {
      if (location) {
        this.address = location.address.street_name;
        this.address += location.address.street_number != undefined ? `, ${location.address.street_number}` : '';
      }
    });

  }

  private prepareSubcategories() {

    this.loadingSrv.show();

    const category_id = this.route.snapshot.queryParamMap.get('category');

    this.subcategorySrv.get(category_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.subcategories = res.data;
        }
      });

  }

  private prepareCompanies() {

    this.loadingSrv.show();

    const category_id = this.route.snapshot.queryParamMap.get('category');

    this.companySrv.getByCategory(category_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          const userLatLng = this.locationSrv.getDeliveryLocation().latLng;

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

}
