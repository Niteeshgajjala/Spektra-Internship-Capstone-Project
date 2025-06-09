import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contributions',
  standalone: true,
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ContributionsComponent implements OnInit {
  contributions: any[] = [];
  newContribution = {
  poolId: null as number | null,
  amount: null as number | null,
  date: '',
  userId: 0  // ✅ Default as number or use `as number`
};


  private apiUrl = 'https://localhost:7127/api/Contribution';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.newContribution.userId = this.getUserIdFromToken();
    this.loadContributions();
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
      'Content-Type': 'application/json'
    });
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

  loadContributions(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.headers }).subscribe({
      next: data => this.contributions = data,
      error: err => {
        console.error('Failed to load contributions:', err);
        alert('Could not load contributions.');
      }
    });
  }

  addContribution(): void {
    if (!this.newContribution.poolId || !this.newContribution.amount || !this.newContribution.date) {
      alert('All fields except User ID are required.');
      return;
    }

    // Ensure userId from token
    this.newContribution.userId = this.getUserIdFromToken();

    this.http.post(this.apiUrl, this.newContribution, { headers: this.headers }).subscribe({
      next: () => {
        this.loadContributions();
        this.resetForm();
      },
      error: err => {
        console.error('Error adding contribution:', err);
        alert('Failed to add contribution.');
      }
    });
  }

  resetForm(): void {
    this.newContribution = {
      poolId: null,
      amount: null,
      date: '',
      userId: this.getUserIdFromToken()
    };
  }
}
