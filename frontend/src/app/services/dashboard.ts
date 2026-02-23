import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.baseUrl}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
