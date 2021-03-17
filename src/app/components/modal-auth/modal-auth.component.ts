import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsHelper } from 'src/app/helpers/utils.helper';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal-auth',
  templateUrl: './modal-auth.component.html',
  styleUrls: ['./modal-auth.component.scss'],
})
export class ModalAuthComponent implements OnInit, OnDestroy {

  @ViewChild(IonSlides) slides: IonSlides;

  public slideActiveIndex = 0;

  public loading: boolean;

  public emailPhone: string;

  public emailPhoneOK: boolean;

  public inputCode: string;

  public inputCodeError: string;

  public signUpError: string;

  public seconds: number;

  public isNewUser: boolean;

  public formGroup: FormGroup;

  private interval: any;

  private unsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private authSrv: AuthService,
    private orderSrv: OrderService,
    private alertSrv: AlertService,
    private apiSrv: ApiService,
    private locationSrv: LocationService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ionViewDidEnter() {
    this.slides.update();
  }

  public get formControl() {
    return this.formGroup.controls;
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public checkEmailPhone() {
    if (this.emailPhone.length > 0) {
      if (UtilsHelper.validateEmail(this.emailPhone) || UtilsHelper.validatePhone(this.emailPhone)) {
        this.emailPhoneOK = true;
      }
      else {
        this.emailPhoneOK = false;
      }
    }
    else {
      this.emailPhoneOK = false;
    }
  }

  public changeInputCode(code: string) {
    this.inputCode = code;
  }

  public prev() {
    if (this.slideActiveIndex == 3) {
      this.slides.slideTo(1);
      this.slideActiveIndex = 1;
    }
    else {
      this.slides.slidePrev();
      this.slideActiveIndex--;
    }
  }

  public next() {

    if (this.slideActiveIndex == 0) {

      this.slides.slideNext();

      this.slideActiveIndex++;

    }

    else if (this.slideActiveIndex == 1 && this.emailPhoneOK) {

      this.inputCode = '';

      this.inputCodeError = '';

      const data: any = {};

      if (this.emailPhone.indexOf('@') > -1) { // se for e-mail
        data.email = this.emailPhone;
      }

      else { // se for número de celular
        data.phone = this.emailPhone;
      }

      this.checkDuplicity(data, () => {
        this.sendCode(data, () => {
          this.slides.slideNext();
          this.slideActiveIndex++;
        });
      });
      
    }

    else if (this.slideActiveIndex == 2) {

      if (this.inputCode.length == 5) {

        const data: any = {
          code: this.inputCode
        };

        if (this.emailPhone.indexOf('@') > -1) { // se for e-mail

          data.email = this.emailPhone;

          this.formGroup.patchValue({
            email: this.emailPhone,
            phone: ''
          });

        }

        else { // se for número de celular

          data.phone = this.emailPhone;

          this.formGroup.patchValue({
            email: '',
            phone: this.emailPhone
          });

        }

        if (this.isNewUser) {

          this.confirmCode(data, () => {
            clearInterval(this.interval);
            this.slides.slideNext();
            this.slideActiveIndex++;
          });

        }

        else {
          this.authenticate(data);
        }

      }

    }

    else if (this.slideActiveIndex == 3) {

      if (this.formGroup.valid) {

        if (this.emailPhone.indexOf('@') > -1) { // se for e-mail

          const data = {
            phone: this.formControl.phone.value.replace(/[^0-9]/g, '')
          }

          this.checkDuplicity(data, () => {
            if (this.isNewUser) {
              this.sendCode(data, () => {
                this.signUpError = '';
                this.slides.slideNext();
                this.slideActiveIndex++;
              });
            }
            else {
              this.signUpError = 'Este número de celular já está sendo usado.';
            }
          });

        }

        else { // se for número de celular
          this.signUp(this.formGroup.value);
        }

      }

    }

    else if (this.slideActiveIndex == 4) {

      if (this.inputCode.length == 5) {

        const data = {
          phone: this.formControl.phone.value.replace(/[^0-9]/g, ''),
          code: this.inputCode
        }

        this.confirmCode(data, () => {
          this.signUp(this.formGroup.value);
        });

      }

    }

  }

  public resendCode() {

    const data: any = {};

    this.inputCode = '';

    this.inputCodeError = '';

    if (this.slideActiveIndex == 2) {
      if (this.emailPhone.indexOf('@') > -1) { // se for e-mail
        data.email = this.emailPhone;
      }
      else { // se for número de celular
        data.phone = this.emailPhone;
      }
    }

    else if (this.slideActiveIndex == 4) {
      data.phone = this.formControl.phone.value.replace(/[^0-9]/g, '');
    }

    this.sendCode(data);

  }

  public signInWithGoogle() {

    try {

      this.authSrv.signInWithGoogle()
        .then(result => {

          result.user.getIdToken()
            .then(token => {

              this.authenticateWithProvider(token);

            });

        });

    } catch (error) {

      this.alertSrv.toast({
        icon: 'error',
        message: 'Ops! Parece que algo deu errado. Por favor, tente novamente.'
      });

    }

  }

  public signInWithFacebook() {

    try {

      this.authSrv.signInWithFacebook()
        .then(result => {

          result.user.getIdToken()
            .then(token => {

              this.authenticateWithProvider(token);

            });

        });

    } catch (error) {

      if (error.code == 'auth/account-exists-with-different-credential') {

        this.alertSrv.show({
          icon: 'warning',
          message: 'Você precisar autenticar sua conta Google conectada anteriormente.',
          confirmButtonText: 'Ok',
          onConfirm: () => {

            this.authSrv.signInWithGoogle(error.email)
              .then(result => {

                result.user.linkWithCredential(error.credential)
                  .then(result => {

                    result.user.getIdToken()
                      .then(token => {

                        this.authenticateWithProvider(token);

                      });

                  });

              });

          }

        });

      }

      else {

        this.alertSrv.toast({
          icon: 'error',
          message: 'Ops! Parece que algo deu errado. Por favor, tente novamente.'
        });

      }

    }

  }

  private sendCode(data: any, callback?: any) {
    this.loading = true;
    clearInterval(this.interval);
    this.apiSrv.sendVerificationCode(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.setInterval();
        if (callback) {
          callback();
        }
      });
  }

  private confirmCode(data: any, callback: any) {
    this.loading = true;
    this.apiSrv.confirmVerificationCode(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.inputCode = '';
          this.inputCodeError = '';
          callback();
        }
        else {
          this.inputCodeError = res.message;
        }
      });
  }

  private authenticateWithProvider(token: string) {

    this.loading = true;

    this.authSrv.authenticateWithProvider(token)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          const order = this.orderSrv.getCurrentOrder();
          
          if (order.location) {

            this.loading = true;

            this.locationSrv.create(order.location)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(res => {

                this.loading = false;

                const order = this.orderSrv.getCurrentOrder();

                order.location.id = res.data.id;

                this.orderSrv.setLocation(order.location);

                this.modalCtrl.dismiss(true);
                
              });

          }

          else {
          
            this.modalCtrl.dismiss(true);

          }

        }

      });

  }

  private authenticate(data: any) {

    this.loading = true;

    this.authSrv.authenticate(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          const order = this.orderSrv.getCurrentOrder();
          
          if (order.location) {

            this.loading = true;

            this.locationSrv.create(order.location)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(res => {

                this.loading = false;

                const order = this.orderSrv.getCurrentOrder();

                order.location.id = res.data.id;

                this.orderSrv.setLocation(order.location);

                this.modalCtrl.dismiss(true);

              });

          }

          else {
          
            this.modalCtrl.dismiss(true);

          }

        }

        else {

          this.inputCodeError = res.message;

        }

      });

  }

  private signUp(data: any) {

    this.loading = true;

    data.phone = data.phone.replace(/[^0-9]/g, '');

    this.authSrv.signUp(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.signUpError = '';
          
          const order = this.orderSrv.getCurrentOrder();
          
          if (order.location) {

            this.loading = true;

            this.locationSrv.create(order.location)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(res => {

                this.loading = false;

                const order = this.orderSrv.getCurrentOrder();

                order.location.id = res.data.id;

                this.orderSrv.setLocation(order.location);

                this.modalCtrl.dismiss(true);

              });

          }
          
          else {
          
            this.modalCtrl.dismiss(true);

          }

        }

        else {

          this.signUpError = res.message;

        }

      });
      
  }

  private checkDuplicity(data: any, callback: any) {
    this.loading = true;
    this.apiSrv.checkDuplicity(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loading = false;
        this.isNewUser = res.success;
        callback();
      });
  }

  private setInterval() {
    this.seconds = 59;
    this.interval = setInterval(() => {
      this.seconds--;
      if (this.seconds == 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

}
