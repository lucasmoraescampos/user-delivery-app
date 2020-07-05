import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.page.html',
  styleUrls: ['./disconnected.page.scss'],
})
export class DisconnectedPage {

  public spinner: boolean = false;

  constructor(
    private network: Network,
    private navCtrl: NavController
  ) { }

  public tryAgain() {

    this.spinner = true;

    setTimeout(() => {

      this.spinner = false;

      if (this.network.type !== 'none') {
        this.navCtrl.back();
      }

    }, 2000);

  }
}
