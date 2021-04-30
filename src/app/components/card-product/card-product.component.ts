import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent {

  @Input() image: string;

  @Input() name: string;

  @Input() description: string;

  @Input() price: number;

  @Input() rebate: number;

  constructor() {}

}
