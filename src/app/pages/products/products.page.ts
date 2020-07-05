import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsPage } from '../modals/product-details/product-details.page';
import { LoadingService } from '../../services/loading/loading.service';
import { ProductService } from 'src/app/services/product/product.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  public is_menu_visible: boolean = false;

  public sessions: Array<any> = [];

  public company: any;

  public segment: string;

  public scrollEvents: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private productSrv: ProductService,
    private companySrv: CompanyService,
    private loadingSrv: LoadingService
  ) {

  }

  ngOnInit() {

    this.prepareSessions();

    this.prepareCompany();

    this.prepareIfExistProduct();

  }

  public async details(id: number) {

    const company_id = this.route.snapshot.queryParamMap.get('company');

    const modal = await this.modalCtrl.create({
      component: ProductDetailsPage,
      cssClass: 'modal-custom',
      componentProps: {
        product: id,
        company: company_id
      }
    });

    return await modal.present();

  }

  public sessionScroll() {

    const sessions = document.getElementsByClassName('session');

    const segments = document.getElementsByClassName('segment');

    const length = sessions.length;

    for (let i = length - 1; i >= 0; i--) {

      if (sessions.item(i).getBoundingClientRect().top <= 130) {

        this.segment = segments.item(i).id.replace(/\D/gim, '');

        segments.item(i).scrollIntoView({ behavior: "auto", inline: "center" });

        this.is_menu_visible = true;

        break;

      }

      else {

        this.is_menu_visible = false;

      }

    }

  }

  public changeSegment(session_id: number) {

    let segment = document.getElementById(`segment${session_id}`);

    let session = document.getElementById(`session${session_id}`);

    this.scrollEvents = false;

    segment.scrollIntoView({ behavior: "auto", inline: "center" });

    session.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      this.scrollEvents = true;
    }, 1000);

  }

  private prepareCompany() {

    const company_id: number = parseInt(this.route.snapshot.queryParamMap.get('company'));

    this.loadingSrv.show();

    this.companySrv.getById(company_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.company = res.data;

          const userLatLng = LocationService.getDeliveryLocation().latLng;

          const companyLatLng = {
            lat: this.company.latitude,
            lng: this.company.longitude
          };

          this.company.distance = LocationService.distance(userLatLng, companyLatLng);

        }
      });
  }

  private prepareSessions() {

    const company_id = this.route.snapshot.queryParamMap.get('company');

    this.loadingSrv.show();

    this.productSrv.getByCompany(company_id)
      .subscribe(res => {

        this.loadingSrv.hide();

        if (res.success) {

          this.sessions = res.data;

          this.segment = this.sessions[0].menu_session_id;

        }
      });
  }

  private prepareIfExistProduct() {

    const product = Number(this.route.snapshot.queryParamMap.get('product'));

    if (product) {

      this.details(product);

    }

  }
}