import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class TabSearchPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  public back() {
    this.navCtrl.back();
  }

}
