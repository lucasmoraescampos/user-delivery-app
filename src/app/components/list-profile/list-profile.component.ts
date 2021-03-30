import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-profile',
  templateUrl: './list-profile.component.html',
  styleUrls: ['./list-profile.component.scss'],
})
export class ListProfileComponent implements OnInit {

  @Input() lines: 'full' | 'none' = 'none';

  @Input() detail: boolean = false;

  private popover: PopoverController;

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {

  }

  public navigate(url: string) {
    this.navCtrl.navigateForward(url);
    if (this.popover) {
      this.popover.dismiss();
    }
  }

}
