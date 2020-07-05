import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public spinner: boolean = false;

  public formGroupRegister: FormGroup;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userSrv: UserService,
    private toastSrv: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.formGroupRegister = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });

  }

  public send() {

    if (this.formGroupRegister.valid) {

      this.spinner = true;

      const user = this.formGroupRegister.value;

      user.phone = this.route.snapshot.queryParamMap.get('phone');

      this.userSrv.registerWithPhone(user)
        .subscribe(res => {

          this.spinner = false;

          if (res.success) {

            this.navCtrl.navigateRoot('tabs/home');

          }
          else {

            this.spinner = false;

            this.toastSrv.error(res.message);

          }

        });

    }
    else {
      this.toastSrv.error('Informe todos os dados!');
    }

  }

}
