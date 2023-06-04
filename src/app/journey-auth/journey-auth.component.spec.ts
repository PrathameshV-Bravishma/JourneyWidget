import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyAuthComponent } from './journey-auth.component';

describe('JourneyAuthComponent', () => {
  let component: JourneyAuthComponent;
  let fixture: ComponentFixture<JourneyAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JourneyAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
