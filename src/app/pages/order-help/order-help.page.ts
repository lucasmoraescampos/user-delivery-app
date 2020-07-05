import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HelpPage } from '../modals/help/help.page';

@Component({
  selector: 'app-order-help',
  templateUrl: './order-help.page.html',
  styleUrls: ['./order-help.page.scss'],
})
export class OrderHelpPage implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  public async help(title: string) {

    const modal = await this.modalCtrl.create({
      component: HelpPage,
      cssClass: 'modal-custom',
      componentProps: {
        title: title
      }
    });

    return await modal.present();

  }

}
