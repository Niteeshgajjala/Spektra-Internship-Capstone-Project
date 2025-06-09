// Angular: Admin View Budget Pools Component

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-budget-pools',
  templateUrl: './view-budget-pools.component.html',
  styleUrls: ['./view-budget-pools.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ViewBudgetPoolsComponent implements OnInit {
  budgetPools: any[] = [];
  searchTerm: string = '';
  apiUrl = 'https://localhost:7127/api/BudgetPool';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPools();
  }

  loadPools(): void {
    const token = localStorage.getItem('jwt'); // Fix: match the key used in login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: data => {this.budgetPools = data; console.log(data);},
      error: err => console.error('Failed to fetch budget pools:', err)
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  filteredPools(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.budgetPools.filter(pool =>
      pool.name.toLowerCase().includes(term) ||
      pool.description?.toLowerCase().includes(term)
    );
  }
}
