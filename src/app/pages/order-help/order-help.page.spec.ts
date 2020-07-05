import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderHelpPage } from './order-help.page';

describe('OrderHelpPage', () => {
  let component: OrderHelpPage;
  let fixture: ComponentFixture<OrderHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
