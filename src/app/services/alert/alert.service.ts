import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import VMasker from 'vanilla-masker';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public confirm(title: string, message: string) {
    return Swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      heightAuto: false,
      reverseButtons: true,
    });
  }

  public input(title: string, message: string, type: any) {

    if (type == 'money') {

      return Swal.fire({
        title: title,
        text: message,
        input: 'text',
        inputValue: '0,00',
        confirmButtonText: 'Confirmar',
        heightAuto: false,
        customClass: {
          input: 'ion-text-center'
        },
        inputAttributes: {
          id: 'swal_input_money',
          inputmode: 'numeric'
        },
        onOpen: () => {
          VMasker(document.querySelector('#swal_input_money')).maskMoney({
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$'
          });
        },
        preConfirm: (value: string) => {
          value = value.replace('R$ ', '');
          value = value.replace('.', '');
          value = value.replace(',', '.');
          return Number(value);
        }
      });

    }

    else {

      return Swal.fire({
        title: title,
        text: message,
        input: type,
        confirmButtonText: 'Confirmar',
        heightAuto: false,
        customClass: {
          input: 'ion-text-center'
        },
      });

    }

  }

  public confirmFeedback(value: number) {

    const style = 'font-size: 20pt; margin: auto 2px';

    let stars = '';

    for (let i = 0; i < value; i++) {
      stars += `<ion-icon name="star" color="warning" style="${style}"></ion-icon>`;
    }

    for (let i = 0; i < 5 - value; i++) {
      stars += `<ion-icon name="star-outline" style="${style}"></ion-icon>`;
    }

    return Swal.fire({
      title: 'Confirmar Avaliação?',
      html: stars,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      heightAuto: false,
      reverseButtons: true,
    });

  }
}
