import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required] // Required dropdown for role
    });
  }

  register() {
  if (this.form.invalid) return;

  this.auth.register(this.form.value).subscribe({
    next: res => {
      alert('Registration successful! Please login.');
      this.router.navigate(['/login']);
    },
    error: err => {
      console.error('Registration failed:', err); // <-- See full response
      alert(err?.error || 'Registration failed. Try again.');
    }
  });
  
}
goToLogin() {
  this.router.navigate(['/login']);
}


}
