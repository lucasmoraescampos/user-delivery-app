import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ProductService } from 'src/app/services/product/product.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ArrayHelper } from 'src/app/helpers/ArrayHelper';
import { CartPage } from '../cart/cart.page';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  public loading: boolean = false;

  public qty_product: number = 1;

  public total_price: number;

  public product: any;

  public selected_complements: Array<any> = [];

  public selected_complements_details: Array<any> = [];

  public required_complements: Array<any> = [];

  public is_valid: boolean = false;

  public note: string;

  constructor(
    private modalCtrl: ModalController,
    private productSrv: ProductService,
    private orderSrv: OrderService,
    private params: NavParams
  ) { }

  ngOnInit() {

    this.prepareProduct();

  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public async add() {

    const company_id: number = parseInt(this.params.get('company'));

    const product: any = {
      id: this.product.id,
      qty: this.qty_product,
      note: this.note
    };

    if (this.selected_complements.length > 0) {

      product.complements = this.selected_complements;

    }

    const product_details: any = {
      id: this.product.id,
      name: this.product.name,
      qty: this.qty_product,
      note: this.note,
      price: this.total_price
    };

    if (this.selected_complements_details.length > 0) {

      product_details.complements = this.selected_complements_details;

    }

    this.orderSrv.addProductDetails(product_details);

    this.orderSrv.addProduct(product, company_id);

    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: CartPage,
      cssClass: 'modal-custom'
    });

    modal.present();

  }

  public changeSubcomplementQty(data: any, subcomplement: any) {

    this.checkRequiredComplements(subcomplement.complement_id, data.type);

    if (data.type == 'add') {

      this.addSubcomplement(subcomplement);

      this.addComplementDetails(subcomplement);

    }

    else if (data.type == 'remove') {

      this.removeSubcomplement(subcomplement);

      this.removeComplementDetails(subcomplement);

    }

  }

  public changeProductQty(type: string) {

    const value: number = this.total_price / this.qty_product;

    if (type == 'add') {

      this.total_price += value;

      this.qty_product++;

    }

    else if (type == 'remove' && this.qty_product > 1) {

      this.total_price -= Number(value);

      this.qty_product--;

    }

  }

  public getComplementAmount(id: number) {

    const index = ArrayHelper.getIndexByKey(this.required_complements, 'id', id);

    return this.required_complements[index].amount;

  }

  private addSubcomplement(subcomplement: any) {

    const complement_index = ArrayHelper.getIndexByKey(this.selected_complements, 'id', subcomplement.complement_id);

    if (this.selected_complements.length == 0 || complement_index == -1) {

      this.selected_complements.push({
        id: subcomplement.complement_id,
        subcomplements: [
          {
            id: subcomplement.id,
            qty: 1
          }
        ]
      });

    }

    else {

      const subcomplement_index = ArrayHelper.getIndexByKey(this.selected_complements[complement_index].subcomplements, 'id', subcomplement.id);

      if (subcomplement_index == -1) {

        this.selected_complements[complement_index].subcomplements.push({
          id: subcomplement.id,
          qty: 1
        });

      }

      else {

        this.selected_complements[complement_index].subcomplements[subcomplement_index].qty++;

      }

    }

    this.total_price += (subcomplement.price * this.qty_product);

  }

  private removeSubcomplement(subcomplement: any) {

    const complement_index = ArrayHelper.getIndexByKey(this.selected_complements, 'id', subcomplement.complement_id);

    if (this.selected_complements.length > 0 && complement_index != -1) {

      const subcomplement_index = ArrayHelper.getIndexByKey(this.selected_complements[complement_index].subcomplements, 'id', subcomplement.id);

      if (subcomplement_index != -1) {

        if (this.selected_complements[complement_index].subcomplements[subcomplement_index].qty > 1) {

          this.selected_complements[complement_index].subcomplements[subcomplement_index].qty--;

        }

        else {

          this.selected_complements[complement_index].subcomplements = ArrayHelper.RemoveItem(this.selected_complements[complement_index].subcomplements, subcomplement_index);

          if (this.selected_complements[complement_index].subcomplements.length == 0) {

            this.selected_complements = ArrayHelper.RemoveItem(this.selected_complements, complement_index);

          }

        }

      }

      this.total_price -= (subcomplement.price * this.qty_product);

    }

  }

  private addComplementDetails(subcomplement: any) {

    const index = ArrayHelper.getIndexByKey(this.selected_complements_details, 'subcomplement_id', subcomplement.id);

    if (this.selected_complements_details.length == 0 || index == -1) {

      this.selected_complements_details.push({
        id: subcomplement.complement_id,
        subcomplement_id: subcomplement.id,
        description: subcomplement.description,
        qty: 1
      });

    }

    else {

      this.selected_complements_details[index].qty++;

    }

  }

  private removeComplementDetails(subcomplement: any) {

    const index = ArrayHelper.getIndexByKey(this.selected_complements_details, 'subcomplement_id', subcomplement.id);

    if (this.selected_complements_details.length > 0 || index != -1) {

      if (this.selected_complements_details[index].qty > 1) {

        this.selected_complements_details[index].qty--;

      }

      else {

        this.selected_complements_details = ArrayHelper.RemoveItem(this.selected_complements_details, index);

      }

    }

  }

  private checkRequiredComplements(id: number, type: string) {

    const index = ArrayHelper.getIndexByKey(this.required_complements, 'id', id);

    if (index != -1) {

      if (type == 'add') {

        this.required_complements[index].amount++;

      }

      else {

        this.required_complements[index].amount--;

      }

      this.is_valid = true;

      this.required_complements.forEach(complement => {

        if (complement.amount < complement.qty_min) {

          this.is_valid = false;

        }

      });

    }

  }

  private prepareProduct() {

    this.loading = true;

    const id = this.params.get('product');

    this.productSrv.getById(id)
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.product = res.data;

          this.total_price = this.product.promotional_price ? Number(this.product.promotional_price) : Number(this.product.price);

          this.prepareRequiredComplements(this.product.complements);

        }

      });
  }

  private prepareRequiredComplements(complements: any) {

    this.product.complements.forEach(complement => {

      if (complement.is_required) {

        this.required_complements.push({
          id: complement.id,
          qty_min: complement.qty_min,
          amount: 0
        });

      }

    });

    this.is_valid = this.required_complements.length == 0;

  }
}
