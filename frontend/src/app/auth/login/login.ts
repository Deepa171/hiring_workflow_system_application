import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
   styleUrl: './login.css',
})
export class LoginComponent {

  email = '';
  password = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
     this.isLoading = true;
    this.http.post(`${environment.apiUrl}/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/candidates']);
      },
      error: err => {
        alert(err.error?.message || 'Login failed');
      }
    });
  }

}
