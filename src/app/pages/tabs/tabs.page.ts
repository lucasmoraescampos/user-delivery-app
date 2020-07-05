import { Component, OnDestroy } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private network: Network,
    private navCtrl: NavController
  ) {

  }

  // ionViewWillEnter() {

  //   if (this.network.type === 'none') {

  //     this.navCtrl.navigateForward('/disconnected');

  //   }

  //   else {

  //     this.navCtrl.navigateRoot('/tabs/home');

  //   }

  // }

}
