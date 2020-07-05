import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
})
export class QuantityComponent implements OnInit {

  @Input() disabled: boolean = false;

  @Output() changeQty = new EventEmitter();

  public quantity: number = 0;

  constructor() { }

  ngOnInit() { }

  public add() {
    this.quantity++;
    this.changeQty.emit({
      qty: this.quantity,
      type: 'add'
    });
  }

  public remove() {
    this.quantity--;
    this.changeQty.emit({
      qty: this.quantity,
      type: 'remove'
    });
  }

}
