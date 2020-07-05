import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    constructor(
        private navCtrl: NavController,
        private userSrv: UserService
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const auth = this.userSrv.auth();
        if (auth) {
            return true;
        }

        this.navCtrl.navigateRoot('welcome');
        return false;
    }
}