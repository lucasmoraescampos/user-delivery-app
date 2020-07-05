import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { UserService } from '../../services/user/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-code-confirmation',
  templateUrl: './code-confirmation.page.html',
  styleUrls: ['./code-confirmation.page.scss'],
})
export class CodeConfirmationPage implements OnInit {

  public params: Params;

  public formGroupCode: FormGroup;

  public loading: boolean = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder,
    private userSrv: UserService
  ) {

    this.params = this.route.queryParams.subscribe(params => {
      this.params = params;
    });

  }

  ngOnInit() {

    this.formGroupCode = this.formBuilder.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required]
    });

  }

  public send() {

    if (this.formGroupCode.valid) {

      this.loading = true;

      const digits = this.formGroupCode.value;

      let code = `${digits.digit1}${digits.digit2}${digits.digit3}${digits.digit4}`;

      if (this.params.type == 'signin') {

        this.userSrv.loginWithConfirmationCode(this.params.number, code)
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.navCtrl.navigateRoot('tabs/home');

            }
            else {

              this.toastSrv.error(res.message);

            }

          });
      }

      else {

        this.loading = false;

        this.navCtrl.navigateForward('signup', {
          queryParams: {
            phone: this.params.number
          }
        });

      }

    }

  }

  public next(input: any, index: number) {

    const data = this.formGroupCode.value;

    if (
      (index == 1 && data.digit1 != '')
      || (index == 2 && data.digit2 != '')
      || (index == 3 && data.digit3 != '')
      || (index == 4 && data.digit4 != '')
    ) {

      input.el.setFocus();

    }

  }

}
