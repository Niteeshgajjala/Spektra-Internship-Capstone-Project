import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-set-budgets',
  templateUrl: './set-budgets.component.html',
  styleUrls: ['./set-budgets.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class SetBudgetsComponent implements OnInit {
  budgets: any[] = [];
  newBudget = {
    budgetId: 0,
    amount: 0,
    userId: 0,
    startDate: '',
    endDate: ''
  };
  isEditing = false;

  private apiUrl = 'https://localhost:7127/api/Budgets';
  private headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshBudgets();
  }

  refreshBudgets(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: (data) => this.budgets = data,
      error: (err) => {
        console.error('Failed to load budgets:', err);
        alert('Could not fetch budgets.');
      }
    });
  }

  addBudget(): void {
  if (!this.newBudget.amount || !this.newBudget.startDate || !this.newBudget.endDate) {
    alert('Please fill in all fields.');
    return;
  }

  const payload: any = {
    amount: this.newBudget.amount,
    startDate: this.newBudget.startDate,
    endDate: this.newBudget.endDate
  };

  if (this.isEditing && this.newBudget.budgetId) {
    // Include budgetId in the payload explicitly
    payload.budgetId = this.newBudget.budgetId;

    this.http.put(`${this.apiUrl}/${this.newBudget.budgetId}`, payload, { headers: this.headers }).subscribe({
      next: () => {
        this.refreshBudgets();
        this.resetForm();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Could not update budget.');
      }
    });
  } else {
    this.http.post(this.apiUrl, payload, { headers: this.headers }).subscribe({
      next: () => {
        this.refreshBudgets();
        this.resetForm();
      },
      error: (err) => {
        console.error('Add failed:', err);
        alert('Could not add budget.');
      }
    });
  }
}



  editBudget(budget: any): void {
  this.newBudget = {
    budgetId: budget.budgetId,
    amount: budget.amount,
    userId: budget.userId, // ✅ Add this line
    startDate: budget.startDate,
    endDate: budget.endDate
  };
  this.isEditing = true;
}




  deleteBudget(id: number): void {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers }).subscribe({
      next: () => this.refreshBudgets(),
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Could not delete budget.');
      }
    });
  }

  resetForm(): void {
    this.newBudget = {
      budgetId: 0,
      amount: 0,
      userId: 0,
      startDate: '',
      endDate: ''
    };
    this.isEditing = false;
  }
}
