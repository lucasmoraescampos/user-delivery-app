import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-card',
  templateUrl: './modal-card.component.html',
  styleUrls: ['./modal-card.component.scss'],
})
export class ModalCardComponent implements OnInit {

  constructor(
    private modaltrl: ModalController
  ) { }

  ngOnInit() {}

  public dismiss() {
    this.modaltrl.dismiss();
  }

  

}
