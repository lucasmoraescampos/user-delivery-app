import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationOptionsPage } from './location-options.page';

describe('LocationOptionsPage', () => {
  let component: LocationOptionsPage;
  let fixture: ComponentFixture<LocationOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
