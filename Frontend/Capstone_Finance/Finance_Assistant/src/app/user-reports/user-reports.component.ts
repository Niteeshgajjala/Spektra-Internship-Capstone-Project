import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  standalone: true,
  imports: [NgChartsModule, RouterModule, CommonModule]
})
export class UserReportsComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // 1. Category Pie Chart
  categoryPieData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  // 2. Monthly Spend Bar Chart
  monthlyBarData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Monthly Spend', data: [] }]
  };

  // 3. Budget vs Spend Donut Chart
  budgetDonutData: ChartData<'doughnut', number[], string> = {
    labels: ['Spent', 'Remaining'],
    datasets: [{ data: [] }]
  };

  // 4. Contributions to Pools Bar Chart
  contributionsBarData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'My Contributions', data: [] }]
  };

  ngOnInit(): void {
    this.loadDummyCategoryPie();
    this.loadDummyMonthlyBar();
    this.loadDummyBudgetDonut();
    this.loadDummyContributionBar();
  }

  // Dummy for Category-wise Spending
  loadDummyCategoryPie() {
    const labels = ['Travel', 'Food', 'Software Licenses', 'Office Supplies', 'Training'];
    const data = [2500, 1800, 1200, 600, 900];
    this.categoryPieData = { labels, datasets: [{ data }] };
  }

  // Dummy for Monthly Spend
  loadDummyMonthlyBar() {
    const labels = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'];
    const data = [1200, 1900, 1400, 2200, 2500];
    this.monthlyBarData = { labels, datasets: [{ label: 'Monthly Spend', data }] };
  }

  // Dummy for Budget vs Spend
  loadDummyBudgetDonut() {
    const totalBudget = 10000;
    const totalSpent = 8000;
    this.budgetDonutData = {
      labels: ['Spent', 'Remaining'],
      datasets: [{ data: [totalSpent, totalBudget - totalSpent] }]
    };
  }

  // Dummy for Contributions to Pools
  loadDummyContributionBar() {
    const poolLabels = ['Travel Fund', 'Project Alpha', 'Marketing Pool', 'Team Event Fund'];
    const contributionData = [500, 1200, 300, 700];
    this.contributionsBarData = {
      labels: poolLabels,
      datasets: [{ label: 'My Contributions', data: contributionData }]
    };
  }
}
