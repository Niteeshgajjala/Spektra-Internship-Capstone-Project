import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [RouterOutlet,RouterModule,CommonModule],
  standalone: true
})
export class UserDashboardComponent {
  userName: string = localStorage.getItem('userName') || 'User';

  constructor(private router: Router, public activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.userName = localStorage.getItem('username') || 'User';
    
    
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
