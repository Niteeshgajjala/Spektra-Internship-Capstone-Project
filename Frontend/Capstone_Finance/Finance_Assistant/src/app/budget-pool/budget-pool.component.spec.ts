import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPoolComponent } from './budget-pool.component';

describe('BudgetPoolComponent', () => {
  let component: BudgetPoolComponent;
  let fixture: ComponentFixture<BudgetPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
