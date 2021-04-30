import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-list-profile',
  templateUrl: './list-profile.component.html',
  styleUrls: ['./list-profile.component.scss'],
})
export class ListProfileComponent implements OnInit {

  @Input() lines: 'full' | 'none' = 'none';

  @Input() detail: boolean = false;

  public user: any;

  private unsubscribe = new Subject();

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private popover: PopoverController,
    private loadingSrv: LoadingService
  ) { }

  ngOnInit() {

    this.initUser();

  }

  public navigate(url: string) {
    this.navCtrl.navigateForward(url);
    if (this.popover) {
      this.popover.dismiss();
    }
  }

  public logout() {
    this.loadingSrv.show();
    this.popover.dismiss();
    this.authSrv.logout()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
      });
  }

  private initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.user = user;
      });
  }

}
