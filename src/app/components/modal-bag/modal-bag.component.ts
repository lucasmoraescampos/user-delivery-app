import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-bag',
  templateUrl: './modal-bag.component.html',
  styleUrls: ['./modal-bag.component.scss'],
})
export class ModalBagComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  public dismiss() {
    this.modalCtrl.dismiss();
  }

}
