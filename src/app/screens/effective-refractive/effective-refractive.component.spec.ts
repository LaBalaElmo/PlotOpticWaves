import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EffectiveRefractiveComponent } from './effective-refractive.component';

describe('EffectiveRefractiveComponent', () => {
  let component: EffectiveRefractiveComponent;
  let fixture: ComponentFixture<EffectiveRefractiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectiveRefractiveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EffectiveRefractiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
