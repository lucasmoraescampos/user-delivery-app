import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { LoadingService } from './services/loading/loading.service';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public loading: boolean = false;

  constructor(
    private platform: Platform,
    private loadingSrv: LoadingService,
    public network: Network,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.prepareLoading();
      this.prepareConnection();
    });
  }

  private prepareLoading() {

    this.loadingSrv.status.subscribe(status => {
      this.loading = status;
    });

  }

  private prepareConnection() {

    this.network.onDisconnect().subscribe(() => {
      this.navCtrl.navigateForward('/disconnected');
    });

    this.network.onConnect().subscribe(() => {
      this.navCtrl.back();
    });
  }
}
