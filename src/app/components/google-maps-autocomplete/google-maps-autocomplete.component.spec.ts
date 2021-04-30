import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoogleMapsAutocompleteComponent } from './google-maps-autocomplete.component';

describe('GoogleMapsAutocompleteComponent', () => {
  let component: GoogleMapsAutocompleteComponent;
  let fixture: ComponentFixture<GoogleMapsAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapsAutocompleteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleMapsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
