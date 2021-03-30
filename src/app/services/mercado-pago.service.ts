import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const Mercadopago: any;

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  constructor() {

    Mercadopago.setPublishableKey(environment.mercadopago.publicKey);

  }

  public getPaymentMethod(cardnumber: string, callback: Function) {

    cardnumber = cardnumber.replace(/[^0-9]/g, '');

    if (cardnumber.length >= 6) {

      let bin = cardnumber.substring(0, 6);
      
      Mercadopago.getPaymentMethod({ bin: bin }, callback);

    }

  };

  public createToken(card: Card, callback: Function) {

    const form = this.createForm(card);

    Mercadopago.createToken(form, callback);

  }

  public clearSession() {

    Mercadopago.clearSession();

  }

  private createForm(card: Card) {

    const form = document.createElement('form');

    const card_number = document.createElement('input');

    card_number.setAttribute('data-checkout', 'cardNumber');

    card_number.setAttribute('value', card.number);

    form.appendChild(card_number);

    const card_holder_name = document.createElement('input');

    card_holder_name.setAttribute('data-checkout', 'cardholderName');

    card_holder_name.setAttribute('value', card.holder_name);

    form.appendChild(card_holder_name);

    const card_expiration_month = document.createElement('input');

    card_expiration_month.setAttribute('data-checkout', 'cardExpirationMonth');

    card_expiration_month.setAttribute('value', card.expiration_month);

    form.appendChild(card_expiration_month);

    const card_expiration_year = document.createElement('input');

    card_expiration_year.setAttribute('data-checkout', 'cardExpirationYear');

    card_expiration_year.setAttribute('value', card.expiration_year);

    form.appendChild(card_expiration_year);

    const security_code = document.createElement('input');

    security_code.setAttribute('data-checkout', 'securityCode');

    security_code.setAttribute('value', card.security_code);

    form.appendChild(security_code);

    const doc_type = document.createElement('input');

    doc_type.setAttribute('data-checkout', 'docType');

    doc_type.setAttribute('value', card.document_type);

    form.appendChild(doc_type);

    const doc_number = document.createElement('input');

    doc_number.setAttribute('data-checkout', 'docNumber');

    doc_number.setAttribute('value', card.document_number);

    form.appendChild(doc_number);

    return form;
  }
}

interface Card {
  number: string;
  holder_name: string;
  expiration_month: string;
  expiration_year: string;
  security_code: string;
  document_type: string;
  document_number: string;
}