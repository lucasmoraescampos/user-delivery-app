import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSearchbar } from '@ionic/angular';
import { LocationService } from '../../services/location/location.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonSearchbar) searchbar: IonSearchbar;

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

    this.searchAnimate();

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

  private searchAnimate() {

    const searches: any[] = [
      'Hamburguer...', 'Almoçar...', 'Jantar...', 'Refrigerante...', 'Cerveja...', 'Açaí...', 'O que você quer hoje?'
    ];

    let i = 0;

    setInterval(() => {

      this.searchbar.placeholder = searches[i];

      if (i == searches.length - 1) i = 0;

      else i++;

    }, 3000);

  }
}
