import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBudgetPoolsComponent } from './view-budget-pools.component';

describe('ViewBudgetPoolsComponent', () => {
  let component: ViewBudgetPoolsComponent;
  let fixture: ComponentFixture<ViewBudgetPoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBudgetPoolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBudgetPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
