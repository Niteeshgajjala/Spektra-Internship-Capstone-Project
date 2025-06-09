import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  selectedCategoryId: number | null = null;
  readonly baseUrl = 'https://localhost:7127/api/Categories';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  loadCategories(): void {
    this.http.get<any[]>(this.baseUrl, this.getAuthHeaders()).subscribe({
      next: data => this.categories = data,
      error: err => console.error('Error fetching categories:', err)
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const formData = this.categoryForm.value;
    const headers = this.getAuthHeaders();

    if (this.isEditing && this.selectedCategoryId != null) {
      this.http.put(`${this.baseUrl}/${this.selectedCategoryId}`, formData, headers).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    } else {
      this.http.post(this.baseUrl, formData, headers).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    }
  }

  editCategory(cat: any): void {
    this.categoryForm.patchValue({
      categoryName: cat.categoryName,
      description: cat.description
    });
    this.selectedCategoryId = cat.categoryId;
    this.isEditing = true;
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders()).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.isEditing = false;
    this.selectedCategoryId = null;
  }
}
