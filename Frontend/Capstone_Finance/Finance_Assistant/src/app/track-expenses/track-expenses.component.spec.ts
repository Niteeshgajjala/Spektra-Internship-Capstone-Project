import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackExpensesComponent } from './track-expenses.component';

describe('TrackExpensesComponent', () => {
  let component: TrackExpensesComponent;
  let fixture: ComponentFixture<TrackExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
