import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  async success(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: 'success',
      cssClass: 'toast-custom',
      duration: duration,
      buttons: [
        {
          side: 'start',
          icon: 'checkmark-circle-outline'
        },
        {
          side: 'end',
          icon: 'close-outline'
        }
      ]
    });
    toast.present();
  }

  async error(message: string, duration: number = 5000) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: 'danger',
      cssClass: 'toast-custom',
      duration: duration,
      buttons: [
        {
          side: 'start',
          icon: 'alert-circle-outline'
        },
        {
          side: 'end',
          icon: 'close-outline'
        }
      ]
    });
    toast.present();
  }
}
