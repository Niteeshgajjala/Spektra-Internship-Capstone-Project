import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBudgetsComponent } from './set-budgets.component';

describe('SetBudgetsComponent', () => {
  let component: SetBudgetsComponent;
  let fixture: ComponentFixture<SetBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetBudgetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
