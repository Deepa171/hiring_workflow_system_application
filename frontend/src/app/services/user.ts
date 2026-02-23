import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getInterviewers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(this.baseUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
