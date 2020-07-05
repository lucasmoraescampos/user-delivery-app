import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocationService } from '../../services/location/location.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public address: string;

  public categories: Array<any>;

  constructor(
    private navCtrl: NavController,
    private locationSrv: LocationService,
    private categorySrv: CategoryService,
    private loadingSrv: LoadingService
  ) {

    if (this.locationSrv.getDeliveryLocation() == null) {
      this.navCtrl.navigateForward('locations');
    }

  }

  ngOnInit() {

    this.prepareAddress();

    this.prepareCategories();

  }

  public refresh(event: any) {

    this.categorySrv.get()
      .subscribe(res => {

        event.target.complete();

        if (res.success) {

          this.categories = res.data;

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

  public select(category: number) {
    this.navCtrl.navigateForward('companies', {
      queryParams: {
        category: category
      }
    });
  }

  private prepareCategories() {

    this.loadingSrv.show();

    this.categorySrv.get()
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {
          this.categories = res.data;
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
}
