import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-track-budget',
  templateUrl: './budget-pool.component.html',
  styleUrls: ['./budget-pool.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TrackBudgetComponent implements OnInit {
  budgetPools: any[] = [];
  poolBalance: any = null;
  selectedPoolId: number | null = null;
  newPool = {
    name: '',
    description: '',
    totalAmount: null
  };

  newContribution: { poolId: number | null; userId: number | null; amount: number | null } = {
  poolId: null,
  userId: null,
  amount: null
};


  contributions: any[] = [];

  apiUrl = 'https://localhost:7127/api/BudgetPool';
  contributionUrl = 'https://localhost:7127/api/Contribution';

  constructor(private http: HttpClient) {}

  get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
      'Content-Type': 'application/json'
    });
  }

  ngOnInit(): void {
    this.loadBudgetPools();
    this.newContribution.userId = this.getUserIdFromToken();
    this.loadContributions();
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

  loadBudgetPools(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: data => this.budgetPools = data,
      error: err => {
        console.error('Error loading pools:', err);
        alert('Could not load budget pools.');
      }
    });
  }

  loadContributions(): void {
    this.http.get<any[]>(this.contributionUrl, { headers: this.headers }).subscribe({
      next: data => this.contributions = data,
      error: err => {
        console.error('Error loading contributions:', err);
        alert('Could not load contributions.');
      }
    });
  }

  createPool(): void {
    if (!this.newPool.name || !this.newPool.totalAmount) {
      alert('Name and Total Amount are required.');
      return;
    }

    this.http.post(this.apiUrl, this.newPool, { headers: this.headers, responseType: 'text' }).subscribe({
      next: () => {
        this.loadBudgetPools();
        this.newPool = { name: '', description: '', totalAmount: null };
      },
      error: err => {
        console.error('Error creating pool:', err);
        alert('Could not create budget pool.');
      }
    });
  }

  addContribution(): void {
    if (!this.newContribution.poolId || !this.newContribution.amount) {
      alert('Pool and Amount are required for contribution.');
      return;
    }

    this.http.post(this.contributionUrl, this.newContribution, { headers: this.headers }).subscribe({
      next: () => {
        alert('Contribution added successfully.');
        this.newContribution.amount = null;
        this.loadContributions();
      },
      error: err => {
        console.error('Error adding contribution:', err);
        alert('Could not add contribution.');
      }
    });
  }

  viewBalance(poolId: number): void {
    this.selectedPoolId = poolId;
    this.http.get(`${this.apiUrl}/balance/${poolId}`, { headers: this.headers }).subscribe({
      next: data => {
        this.poolBalance = data;
        alert(`Balance for Pool ID ${poolId}: ₹${this.poolBalance.currentBalance}`);
      },
      error: err => {
        console.error('Error fetching balance:', err);
        alert('Could not fetch pool balance.');
      }
    });
  }
}
