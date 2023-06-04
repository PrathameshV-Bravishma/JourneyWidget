import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJourneyProfileComponent } from './new-journey-profile.component';

describe('NewJourneyProfileComponent', () => {
  let component: NewJourneyProfileComponent;
  let fixture: ComponentFixture<NewJourneyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJourneyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJourneyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
