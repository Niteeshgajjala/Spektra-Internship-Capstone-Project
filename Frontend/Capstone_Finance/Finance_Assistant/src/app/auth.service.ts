import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post('https://localhost:7127/api/User/login', data); // Replace with your actual API
  }

  register(data: any): Observable<any> {
  return this.http.post('https://localhost:7127/api/User/register', data); // Update endpoint as per your backend
  }
}
