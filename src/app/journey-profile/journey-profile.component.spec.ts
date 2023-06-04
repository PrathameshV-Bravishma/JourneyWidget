import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyProfileComponent } from './journey-profile.component';

describe('JourneyProfileComponent', () => {
  let component: JourneyProfileComponent;
  let fixture: ComponentFixture<JourneyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JourneyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
