import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header-location-search',
  templateUrl: './header-location-search.component.html',
  styleUrls: ['./header-location-search.component.scss'],
})
export class HeaderLocationSearchComponent implements OnInit {

  @Input() btnBack: boolean = true;
  @Input() search: boolean = true;

  public address: string;

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {

  }

  public back() {
    this.navCtrl.navigateRoot('tabs/home');
  }

  public focusSearch() {
    this.navCtrl.navigateRoot('tabs/search');
  }

  public location() {
    this.navCtrl.navigateForward('locations', {
      queryParams: {
        btnBack: true
      }
    });
  }
}
