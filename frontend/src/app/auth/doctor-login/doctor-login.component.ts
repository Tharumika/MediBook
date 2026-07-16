import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="auth-page">

      <!-- Left brand panel — teal/dark theme for doctors -->
      <div class="brand-panel">
        <div class="brand-inner">
          <div class="brand-logo">
            <img src="assets/logo.png" alt="MediBook" class="logo-img">
            <span>MediBook</span>
          </div>
          <div class="portal-badge">
            <mat-icon>medical_services</mat-icon> Doctor Portal
          </div>
          <h1>Manage your patients, your way</h1>
          <p>View your schedule, confirm appointments, and keep track of your patients — all in one dashboard.</p>
          <div class="features">
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>calendar_month</mat-icon></div>
              <div>
                <strong>Schedule Overview</strong>
                <p>See all upcoming appointments at a glance</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>check_circle</mat-icon></div>
              <div>
                <strong>One-Click Confirm</strong>
                <p>Approve patient bookings instantly</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>insights</mat-icon></div>
              <div>
                <strong>Practice Insights</strong>
                <p>Track pending, confirmed and completed visits</p>
              </div>
            </div>
          </div>
        </div>
        <div class="brand-graphic">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
          <div class="circle c3"></div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="form-panel">
        <div class="form-inner">

          <div class="form-top">
            <div class="role-badge">
              <mat-icon>medical_services</mat-icon> Doctor Access
            </div>
            <h2>Doctor Sign In</h2>
            <p>Access your MediBook doctor dashboard</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field-group">
              <label>Doctor Email</label>
              <div class="input-wrap" [class.has-error]="touched('email') && form.get('email')?.invalid">
                <mat-icon>email</mat-icon>
                <input type="email" formControlName="email" placeholder="doctor@hospital.com" autocomplete="email">
              </div>
              <span class="field-error" *ngIf="touched('email') && form.get('email')?.hasError('required')">Email is required</span>
              <span class="field-error" *ngIf="touched('email') && form.get('email')?.hasError('email')">Enter a valid email</span>
            </div>

            <div class="field-group">
              <label>Password</label>
              <div class="input-wrap" [class.has-error]="touched('password') && form.get('password')?.invalid">
                <mat-icon>lock_outline</mat-icon>
                <input [type]="showPass ? 'text' : 'password'" formControlName="password" placeholder="••••••••" autocomplete="current-password">
                <button type="button" class="toggle-pass" (click)="showPass = !showPass">
                  <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            <div class="error-banner" *ngIf="errorMsg">
              <mat-icon>error_outline</mat-icon>{{ errorMsg }}
            </div>

            <div class="wrong-portal" *ngIf="wrongRole">
              <mat-icon>info</mat-icon>
              This account is not a Doctor account.
              <a routerLink="/login">Patient login →</a>
            </div>

            <button class="btn-primary doctor-btn" type="submit" [disabled]="loading">
              <span class="spin" *ngIf="loading"></span>
              <span *ngIf="!loading">Sign In to Doctor Portal</span>
            </button>
          </form>

          <p class="switch-link">Are you a patient? <a routerLink="/login">Patient login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; }

    .brand-panel {
      flex: 1;
      background: linear-gradient(145deg, #0f172a 0%, #0d3d38 50%, #0f9d8c 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 48px; position: relative; overflow: hidden;
      @media (max-width: 768px) { display: none; }
    }

    .brand-inner { position: relative; z-index: 1; max-width: 420px; }

    .brand-logo {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
      .logo-img { width: 44px; height: 44px; border-radius: 12px; object-fit: cover; }
      span { font-size: 24px; font-weight: 800; color: #fff; }
    }

    .portal-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(15,157,140,0.2); border: 1px solid rgba(15,157,140,0.4);
      color: #5eead4; border-radius: 99px;
      padding: 5px 14px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.04em; margin-bottom: 20px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .brand-inner h1 { font-size: 36px; font-weight: 800; color: #fff; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.5px; }
    .brand-inner > p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 36px; }

    .features { display: flex; flex-direction: column; gap: 20px; }
    .feature-item {
      display: flex; align-items: flex-start; gap: 14px;
      .feat-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        mat-icon { color: #5eead4; font-size: 20px; }
      }
      strong { display: block; color: #e2e8f0; font-size: 14px; font-weight: 600; }
      p { color: #64748b; font-size: 13px; margin: 3px 0 0; }
    }

    .brand-graphic { position: absolute; inset: 0; pointer-events: none; }
    .circle { position: absolute; border-radius: 50%; }
    .c1 { width: 500px; height: 500px; bottom: -200px; right: -150px; background: rgba(255,255,255,0.03); }
    .c2 { width: 280px; height: 280px; top: -60px; right: 60px; background: rgba(15,157,140,0.1); }
    .c3 { width: 140px; height: 140px; top: 45%; left: -40px; background: rgba(94,234,212,0.05); }

    .form-panel {
      width: 480px; display: flex; align-items: center; justify-content: center;
      background: #f8fafc; padding: 40px;
      @media (max-width: 768px) { width: 100%; }
    }

    .form-inner { width: 100%; max-width: 380px; }

    .form-top { margin-bottom: 28px; }

    .role-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: #e0f2f1; color: #0f9d8c; border-radius: 99px;
      padding: 4px 12px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.04em; margin-bottom: 14px;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }

    .form-top h2 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.5px; }
    .form-top p  { font-size: 14px; color: #64748b; margin: 0; }

    .doctor-btn { background: #0f9d8c; box-shadow: 0 2px 8px rgba(15,157,140,0.35);
      &:hover:not(:disabled) { background: #0d7a6e; box-shadow: 0 4px 12px rgba(15,157,140,0.45); }
    }

    .wrong-portal {
      display: flex; align-items: center; gap: 8px;
      background: #fff8e1; border: 1px solid #ffe082; color: #f57f17;
      border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
      mat-icon { font-size: 18px; }
      a { font-weight: 700; color: #1a73e8; margin-left: 4px; }
    }

    .switch-link { text-align: center; font-size: 14px; color: #64748b; margin: 20px 0 0; a { font-weight: 600; } }
  `]
})
export class DoctorLoginComponent {
  form: FormGroup;
  loading = false;
  showPass = false;
  errorMsg = '';
  wrongRole = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  touched(f: string) { return this.form.get(f)?.touched; }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.wrongRole = false;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        if (res.role !== 'DOCTOR') {
          this.loading = false;
          this.wrongRole = true;
          this.auth.logout();
          return;
        }
        this.router.navigate(['/doctor/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Invalid credentials.';
      }
    });
  }
}
