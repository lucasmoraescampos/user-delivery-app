import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { ProductService } from 'src/app/services/product/product.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {

  public search: string;

  public searches: Array<any>;

  public products: Array<any>;

  public companies: Array<any>;

  public segment: number = 1;

  constructor(
    private companySrv: CompanyService,
    private productSrv: ProductService,
    private loadingSrv: LoadingService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareSearches();

  }

  public segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  public clearSearch() {

    this.products = null;

    this.companies = null;

  }

  public deleteHistory() {

    this.alertSrv.confirm('Buscas Recentes', 'Apagar buscas recentes?')
      .then(res => {

        if (res.isConfirmed) {

          UserService.removeSearches();

          this.searches = null;

        }

      });

  }

  public selectSearch(index: number) {

    this.search = this.searches[index];

    UserService.removeSearchByIndex(index);

    this.doSearch();

  }

  public doSearch() {

    if (this.search.length > 0) {

      UserService.setSearch(this.search);

      this.prepareProducts(this.search);

      this.prepareCompanies(this.search);

      this.prepareSearches();

    }

  }

  private prepareProducts(search: string) {

    this.loadingSrv.show();

    this.productSrv.getBySearch(search)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          this.products = [];

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

  private prepareCompanies(search: string) {

    this.loadingSrv.show();

    this.companySrv.getBySearch(search)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          this.companies = [];

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

  private prepareSearches() {

    this.searches = UserService.searches();

  }
}
