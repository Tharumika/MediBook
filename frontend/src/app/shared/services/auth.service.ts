import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, DoctorRegisterRequest } from '../models/auth.models';

const API = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest) {
    return this.http.post<AuthResponse>(`${API}/login`, req).pipe(
      tap(res => this.storeSession(res))
    );
  }

  register(req: RegisterRequest) {
    return this.http.post<AuthResponse>(`${API}/register`, req).pipe(
      tap(res => this.storeSession(res))
    );
  }

  registerDoctor(req: DoctorRegisterRequest) {
    return this.http.post<AuthResponse>(`${API}/register/doctor`, req).pipe(
      tap(res => this.storeSession(res))
    );
  }

  logout() {
    localStorage.removeItem('medibook_token');
    localStorage.removeItem('medibook_user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('medibook_token');
  }

  getUser(): AuthResponse | null {
    const raw = localStorage.getItem('medibook_user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  private storeSession(res: AuthResponse) {
    localStorage.setItem('medibook_token', res.token);
    localStorage.setItem('medibook_user', JSON.stringify(res));
  }
}
