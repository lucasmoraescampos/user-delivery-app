import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChoosePaymentMethodComponent } from './modal-choose-payment-method.component';

describe('ModalChoosePaymentMethodComponent', () => {
  let component: ModalChoosePaymentMethodComponent;
  let fixture: ComponentFixture<ModalChoosePaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChoosePaymentMethodComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalChoosePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
