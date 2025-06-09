import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-track-expenses',
  templateUrl: './track-expenses.component.html',
  styleUrls: ['./track-expenses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TrackExpensesComponent implements OnInit {
  expenses: any[] = [];
  newExpense = {
    expenseId: null,
    poolId: null,
    userId: 0,
    categoryId: null,
    amount: null,
    description: '',
    date: ''
  };

  private apiUrl = 'https://localhost:7127/api/Expense';

  constructor(private http: HttpClient) {}

  get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
      'Content-Type': 'application/json'
    });
  }

  ngOnInit(): void {
    this.newExpense.userId = this.getUserIdFromToken();
    this.fetchAllExpenses();
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('jwt');
    if (!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return +payload['UserId'];
    } catch {
      return 0;
    }
  }

  fetchAllExpenses(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: data => this.expenses = data,
      error: err => {
        console.error('Failed to load all expenses:', err);
        alert('Could not fetch all expenses.');
      }
    });
  }

  addExpense(): void {
    if (!this.newExpense.description || !this.newExpense.amount || !this.newExpense.categoryId || !this.newExpense.poolId || !this.newExpense.date) {
      alert('Please fill in all fields.');
      return;
    }

    const payload = {
      expenseId: 0, // API expects a value (or remove from model if not used)
      poolId: this.newExpense.poolId,
      userId: this.getUserIdFromToken(),
      categoryId: this.newExpense.categoryId,
      amount: this.newExpense.amount,
      description: this.newExpense.description,
      date: this.newExpense.date // or convert to ISO if needed
    };

    console.log('Payload being sent:', payload);

    this.http.post(this.apiUrl, payload, { headers: this.headers }).subscribe({
      next: () => {
        this.fetchAllExpenses();
        this.resetForm();
      },
      error: err => {
        console.error('Add failed:', err);
        alert('Could not add expense.');
      }
    });
  }

  deleteExpense(expenseId: number): void {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    this.http.delete(`${this.apiUrl}/${expenseId}`, { headers: this.headers }).subscribe({
      next: () => this.fetchAllExpenses(),
      error: err => {
        console.error('Delete failed:', err);
        alert('Could not delete expense.');
      }
    });
  }

  resetForm(): void {
    this.newExpense = {
      expenseId: null,
      poolId: null,
      userId: this.getUserIdFromToken(),
      categoryId: null,
      amount: null,
      description: '',
      date: ''
    };
  }
}
