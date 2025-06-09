import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        if (res.token && res.role) {
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('role', res.role);

          const targetRoute = res.role.toLowerCase() === 'admin' ? '/admin-dashboard' : '/user-dashboard';
          this.router.navigate([targetRoute]);
        } else {
          alert('Invalid login response from server.');
        }
      },
      error: () => {
        alert('Login failed. Check your credentials.');
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToForgotPassword(): void {
  this.router.navigate(['/forgot-password']);
}
}
