import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  editingUserId: number | null = null;
  searchTerm: string = '';
  readonly url = 'https://localhost:7127/api/User';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>(this.url, { headers: this.getAuthHeaders() })
      .subscribe(users => this.users = users);
  }

  saveUser(): void {
    if (this.editingUserId) {
      this.http.put(`${this.url}/${this.editingUserId}`, this.userForm.value, { headers: this.getAuthHeaders() })
        .subscribe(() => {
          this.cancelEdit();
          this.loadUsers();
        });
    } else {
      this.http.post(this.url, this.userForm.value, { headers: this.getAuthHeaders() })
        .subscribe(() => {
          this.userForm.reset();
          this.loadUsers();
        });
    }
  }

  editUser(user: any): void {
    this.userForm.setValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    this.editingUserId = user.id;
  }

  cancelEdit(): void {
    this.userForm.reset();
    this.editingUserId = null;
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure to delete this user?')) {
      this.http.delete(`${this.url}/${id}`, { headers: this.getAuthHeaders() })
        .subscribe(() => this.loadUsers());
    }
  }

  filteredUsers(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }
}
