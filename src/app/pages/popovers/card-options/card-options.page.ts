import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-card-options',
  templateUrl: './card-options.page.html',
  styleUrls: ['./card-options.page.scss'],
})
export class CardOptionsPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  public select(option: string) {

    this.popoverCtrl.dismiss(option);

  }
}
