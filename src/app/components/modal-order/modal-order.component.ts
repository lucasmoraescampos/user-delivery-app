import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.component.html',
  styleUrls: ['./modal-order.component.scss'],
})
export class ModalOrderComponent implements OnInit {

  @Input() order: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  public dismiss() {
    this.modalCtrl.dismiss();
  }

}
