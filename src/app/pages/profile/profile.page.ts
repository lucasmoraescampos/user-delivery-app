import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class TabProfilePage implements OnInit, OnDestroy {

  public user: any;

  private unsubscribe = new Subject();

  constructor(
    private authSrv: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initUser();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public back() {
    this.navCtrl.back();
  }

  public initUser() {
    this.authSrv.currentUser.pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.user = user;
      });
  }

}
