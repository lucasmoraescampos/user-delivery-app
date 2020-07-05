import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  public formGroupAddress: FormGroup;

  public type: number;

  public is_update: boolean = false;

  public address: any;

  public spinner: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private locationSrv: LocationService
  ) { }

  ngOnInit() {

    this.address = this.navParams.get('address');

    const latLng = this.navParams.get('latLng');

    if (this.address.id != undefined) {

      this.is_update = true;

      this.type = this.address.type;

    }

    this.formGroupAddress = this.formBuilder.group({
      street_name: [this.address.street_name, Validators.required],
      street_number: [this.address.street_number, Validators.required],
      district: [this.address.district, Validators.required],
      city: [this.address.city, Validators.required],
      uf: [this.address.uf, Validators.required],
      country: [this.address.country, Validators.required],
      postal_code: [this.address.postal_code, Validators.required],
      latitude: [latLng.lat, Validators.required],
      longitude: [latLng.lng, Validators.required],
      complement: ['']
    });

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public changeType(type: number) {

    if (type == 1 && this.type != 1) {
      this.type = 1;
    }

    else if (type == 1 && this.type == 1) {
      this.type = null;
    }

    else if (type == 2 && this.type != 2) {
      this.type = 2;
    }

    else if (type == 2 && this.type == 2) {
      this.type = null;
    }

  }

  public save() {

    if (this.formGroupAddress.valid) {

      this.spinner = true;

      const address: any = this.formGroupAddress.value;

      address.type = this.type;

      this.locationSrv.create(address)
        .subscribe(res => {

          if (res.success) {

            this.modalCtrl.dismiss(res.data);

          }

        });

    }

    else {

      this.toastSrv.error('Preencha todos os campos!');

    }

  }

  public update() {

    if (this.formGroupAddress.valid) {

      this.spinner = true;

      const address: any = this.formGroupAddress.value;

      address.type = this.type;

      this.locationSrv.update(this.address.id, address)
        .subscribe(res => {

          if (res.success) {

            this.modalCtrl.dismiss(res.data);

          }

        });

    }

    else {

      this.toastSrv.error('Preencha todos os campos!');

    }

  }
}
