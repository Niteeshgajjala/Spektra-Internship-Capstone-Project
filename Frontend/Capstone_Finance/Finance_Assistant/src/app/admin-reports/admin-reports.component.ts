import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  standalone: true,
  imports: [NgChartsModule, CommonModule]
})
export class AdminReportsComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  adminCategoryData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Total Spend', data: [] }]
  };

  adminTopUserData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  ngOnInit(): void {
    this.loadAdminCategoryExpenses();
    this.loadTopUsers();
  }

  loadAdminCategoryExpenses() {
    const dummyCategoryData = [
      { category: 'Travel', total: 2000 },
      { category: 'Software', total: 1500 },
      { category: 'Hardware', total: 1000 },
      { category: 'Food', total: 800 },
      { category: 'Training', total: 600 }
    ];

    const labels = dummyCategoryData.map(d => d.category);
    const data = dummyCategoryData.map(d => d.total);

    this.adminCategoryData = {
      labels,
      datasets: [{ label: 'Total Spend', data }]
    };
  }

  loadTopUsers() {
    const dummyUserData = [
      { name: 'Niteesh', total: 3000 },
      { name: 'Harshith', total: 2500 },
      { name: 'Dheeraj', total: 1800 },
      { name: 'Jai', total: 1400 }
    ];

    const labels = dummyUserData.map(u => u.name);
    const data = dummyUserData.map(u => u.total);

    this.adminTopUserData = {
      labels,
      datasets: [{ data }]
    };
  }
}
