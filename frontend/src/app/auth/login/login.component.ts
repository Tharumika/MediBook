import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="auth-page">

      <!-- Left brand panel -->
      <div class="brand-panel">
        <div class="brand-inner">
          <div class="brand-logo">
            <mat-icon>local_hospital</mat-icon>
            <span>MediBook</span>
          </div>
          <h1>Healthcare at your fingertips</h1>
          <p>Book appointments, connect with specialists, and manage your health journey — all in one place.</p>
          <div class="features">
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>bolt</mat-icon></div>
              <div>
                <strong>Instant Booking</strong>
                <p>Schedule in under 60 seconds</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>verified</mat-icon></div>
              <div>
                <strong>Verified Doctors</strong>
                <p>All specialists are board-certified</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>lock</mat-icon></div>
              <div>
                <strong>Private & Secure</strong>
                <p>Your data is encrypted end-to-end</p>
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
            <h2>Welcome back</h2>
            <p>Sign in to your MediBook account</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field-group">
              <label>Email address</label>
              <div class="input-wrap" [class.has-error]="touched('email') && form.get('email')?.invalid">
                <mat-icon>email</mat-icon>
                <input type="email" formControlName="email" placeholder="you@example.com" autocomplete="email">
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

            <button class="btn-primary" type="submit" [disabled]="loading">
              <span class="spin" *ngIf="loading"></span>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <p class="switch-link">Don't have an account? <a routerLink="/register">Create one free</a></p>

          <div class="quick-access">
            <p class="qa-label">Quick access</p>
            <div class="qa-tiles">
              <button class="qa-tile" (click)="demo('patient')">
                <div class="qa-icon patient"><mat-icon>person</mat-icon></div>
                <div class="qa-info">
                  <strong>Patient</strong>
                  <span>Sign in as patient</span>
                </div>
                <mat-icon class="qa-arrow">chevron_right</mat-icon>
              </button>
              <button class="qa-tile" (click)="demo('doctor')">
                <div class="qa-icon doctor"><mat-icon>medical_services</mat-icon></div>
                <div class="qa-info">
                  <strong>Doctor</strong>
                  <span>Sign in as doctor</span>
                </div>
                <mat-icon class="qa-arrow">chevron_right</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      min-height: 100vh;
    }

    /* ── Brand panel ── */
    .brand-panel {
      flex: 1;
      background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #1a73e8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      position: relative;
      overflow: hidden;

      @media (max-width: 768px) { display: none; }
    }

    .brand-inner {
      position: relative;
      z-index: 1;
      max-width: 420px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 40px;

      mat-icon { color: #60a5fa; font-size: 32px; width: 32px; height: 32px; }
      span { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    }

    .brand-inner h1 {
      font-size: 38px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
      margin: 0 0 16px;
      letter-spacing: -0.5px;
    }

    .brand-inner > p {
      font-size: 16px;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 40px;
    }

    .features { display: flex; flex-direction: column; gap: 20px; }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;

      .feat-icon {
        width: 40px; height: 40px;
        background: rgba(255,255,255,0.08);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        mat-icon { color: #60a5fa; font-size: 20px; }
      }

      strong { display: block; color: #e2e8f0; font-size: 14px; font-weight: 600; }
      p { color: #64748b; font-size: 13px; margin: 3px 0 0; }
    }

    /* decorative circles */
    .brand-graphic { position: absolute; inset: 0; pointer-events: none; }
    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .c1 { width: 500px; height: 500px; bottom: -200px; right: -150px; }
    .c2 { width: 300px; height: 300px; top: -80px; right: 40px; background: rgba(26,115,232,0.1); }
    .c3 { width: 150px; height: 150px; top: 40%; left: -40px; background: rgba(96,165,250,0.08); }

    /* ── Form panel ── */
    .form-panel {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 40px;

      @media (max-width: 768px) { width: 100%; }
    }

    .form-inner { width: 100%; max-width: 380px; }

    .form-top {
      margin-bottom: 32px;
      h2 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.5px; }
      p { font-size: 14px; color: #64748b; margin: 0; }
    }

    .switch-link {
      text-align: center;
      font-size: 14px;
      color: #64748b;
      margin: 20px 0 24px;
      a { font-weight: 600; }
    }

    .quick-access { margin-top: 8px; }

    .qa-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin: 0 0 10px;
    }

    .qa-tiles { display: flex; flex-direction: column; gap: 8px; }

    .qa-tile {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
      text-align: left;

      &:hover {
        border-color: #1a73e8;
        background: #f0f7ff;
        transform: translateX(2px);
        box-shadow: 0 2px 8px rgba(26,115,232,0.12);
      }
    }

    .qa-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &.patient { background: #e0f2f1; mat-icon { color: #0f9d8c; } }
      &.doctor  { background: #e8f0fe; mat-icon { color: #1a73e8; } }
    }

    .qa-info {
      flex: 1;
      strong { display: block; font-size: 13px; font-weight: 700; color: #1a202c; }
      span   { font-size: 11px; color: #94a3b8; }
    }

    .qa-arrow { color: #cbd5e0; font-size: 20px; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  showPass = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  touched(field: string) {
    return this.form.get(field)?.touched;
  }

  demo(role: 'patient' | 'doctor') {
    const accounts = {
      patient: { email: 'patient@medibook.com', password: 'Patient@123' },
      doctor:  { email: 'doctor@medibook.com',  password: 'Doctor@123' }
    };
    this.form.patchValue(accounts[role]);
    this.submit();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Invalid email or password.';
      }
    });
  }
}
