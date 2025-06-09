import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = 'Admin';
  sidebarCollapsed: boolean = false;
  isDarkTheme: boolean = false;

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('userName');
    const theme = localStorage.getItem('theme');

    // Redirect if not admin
    if (role !== 'Admin') {
      this.router.navigate(['/login']);
    } else if (name) {
      this.adminName = name;
    }

    // Load saved theme preference
    this.isDarkTheme = theme === 'dark';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
