import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card-company',
  templateUrl: './card-company.component.html',
  styleUrls: ['./card-company.component.scss'],
})
export class CardCompanyComponent implements OnInit {

  @Input() slug: string;

  @Input() open: boolean;

  @Input() image: string;

  @Input() name: string;

  @Input() evaluation: number;

  @Input() distance: number;

  @Input() waiting_time: number;

  @Input() delivery_price: number;

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  public openCompany() {
    this.navCtrl.navigateForward(`/${this.slug}`);
  }

}
