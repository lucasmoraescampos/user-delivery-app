import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisconnectedPage } from './disconnected.page';

describe('DisconnectedPage', () => {
  let component: DisconnectedPage;
  let fixture: ComponentFixture<DisconnectedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
