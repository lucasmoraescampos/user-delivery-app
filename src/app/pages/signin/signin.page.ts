import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  public spinner: boolean = false;

  public params: Params;

  public formGroupPhone: FormGroup;

  constructor(
    private navCtrl: NavController,
    private userSrv: UserService,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {

    this.params = this.route.queryParams.subscribe(params => {
      this.params = params;
    });

  }

  ngOnInit() {

    this.formGroupPhone = this.formBuilder.group({
      number: ['', [Validators.required, Validators.minLength(14)]]
    });

  }

  public send() {

    if (this.formGroupPhone.valid) {

      this.spinner = true;

      if (this.params.type == 'signin') {

        this.userSrv.sendLoginCodeConfirmation(this.formGroupPhone.value.number)
          .subscribe(res => {

            this.spinner = false;

            if (res.success) {

              this.navCtrl.navigateForward('code-confirmation', {
                queryParams: {
                  code: res.data.code,
                  number: this.formGroupPhone.value.number,
                  type: this.params.type
                }
              });

            }
            else {

              this.toastSrv.error(res.message);

            }

          });

      }

      else {

        this.userSrv.verifyPhone(this.formGroupPhone.value.number)
          .subscribe(res => {

            this.spinner = false;

            if (res.success) {

              this.userSrv.sendRegisterCodeConfirmation(this.formGroupPhone.value.number)
                .subscribe(res => {

                  this.navCtrl.navigateForward('code-confirmation', {
                    queryParams: {
                      code: res.data.code,
                      number: this.formGroupPhone.value.number,
                      type: this.params.type
                    }
                  });

                });

            }
            else {

              this.toastSrv.error(res.message);

            }

          });

      }

    }

  }

}
