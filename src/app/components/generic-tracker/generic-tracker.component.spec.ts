import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTrackerComponent } from './generic-tracker.component';

describe('GenericTrackerComponent', () => {
  let component: GenericTrackerComponent;
  let fixture: ComponentFixture<GenericTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
