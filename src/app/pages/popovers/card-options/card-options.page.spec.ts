import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardOptionsPage } from './card-options.page';

describe('CardOptionsPage', () => {
  let component: CardOptionsPage;
  let fixture: ComponentFixture<CardOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
