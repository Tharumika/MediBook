import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="auth-page">

      <div class="brand-panel">
        <div class="brand-inner">
          <div class="brand-logo">
            <img src="assets/logo.png" alt="MediBook" class="logo-img">
            <span>MediBook</span>
          </div>
          <h1>Your health, simplified</h1>
          <p>Join thousands of patients who trust MediBook to connect with the right doctors at the right time.</p>
          <div class="perks">
            <div class="perk"><mat-icon>check_circle</mat-icon> Free to sign up</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> Access 10+ specializations</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> Cancel anytime</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> 24/7 appointment visibility</div>
          </div>
        </div>
        <div class="brand-graphic">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-inner">
          <div class="form-top">
            <h2>Create your account</h2>
            <p>Start booking appointments in minutes</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field-group">
              <label>Full name</label>
              <div class="input-wrap" [class.has-error]="touched('fullName') && form.get('fullName')?.invalid">
                <mat-icon>person_outline</mat-icon>
                <input type="text" formControlName="fullName" placeholder="John Doe" autocomplete="name">
              </div>
              <span class="field-error" *ngIf="touched('fullName') && form.get('fullName')?.hasError('required')">Full name is required</span>
            </div>

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
                <input [type]="showPass ? 'text' : 'password'" formControlName="password" placeholder="Min. 8 characters" autocomplete="new-password">
                <button type="button" class="toggle-pass" (click)="showPass = !showPass">
                  <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              <span class="field-error" *ngIf="touched('password') && form.get('password')?.hasError('required')">Password is required</span>
              <span class="field-error" *ngIf="touched('password') && form.get('password')?.hasError('minlength')">At least 8 characters</span>
            </div>

            <div class="password-strength" *ngIf="form.get('password')?.value">
              <div class="strength-bar">
                <div class="strength-fill" [style.width]="strengthWidth" [class]="strengthClass"></div>
              </div>
              <span class="strength-label" [class]="strengthClass">{{ strengthLabel }}</span>
            </div>

            <div class="error-banner" *ngIf="errorMsg">
              <mat-icon>error_outline</mat-icon>{{ errorMsg }}
            </div>

            <button class="btn-primary" type="submit" [disabled]="loading">
              <span class="spin" *ngIf="loading"></span>
              <span *ngIf="!loading">Create Account</span>
            </button>

            <p class="terms">By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
          </form>

          <p class="switch-link">Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; }

    .brand-panel {
      flex: 1;
      background: linear-gradient(145deg, #0f172a 0%, #134e4a 50%, #0f9d8c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      position: relative;
      overflow: hidden;
      @media (max-width: 768px) { display: none; }
    }

    .brand-inner { position: relative; z-index: 1; max-width: 420px; }

    .brand-logo {
      display: flex; align-items: center; gap: 12px; margin-bottom: 40px;
      .logo-img { width: 44px; height: 44px; border-radius: 12px; object-fit: cover; }
      span { font-size: 24px; font-weight: 800; color: #fff; }
    }

    .brand-inner h1 { font-size: 38px; font-weight: 800; color: #fff; margin: 0 0 16px; line-height: 1.2; letter-spacing: -0.5px; }
    .brand-inner > p { font-size: 16px; color: #94a3b8; margin: 0 0 36px; line-height: 1.6; }

    .perks { display: flex; flex-direction: column; gap: 14px; }
    .perk {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; color: #e2e8f0; font-weight: 500;
      mat-icon { color: #5eead4; font-size: 20px; }
    }

    .brand-graphic { position: absolute; inset: 0; pointer-events: none; }
    .circle { position: absolute; border-radius: 50%; }
    .c1 { width: 500px; height: 500px; bottom: -200px; right: -150px; background: rgba(255,255,255,0.03); }
    .c2 { width: 250px; height: 250px; top: -60px; right: 60px; background: rgba(15,157,140,0.12); }

    .form-panel {
      width: 480px;
      display: flex; align-items: center; justify-content: center;
      background: #f8fafc; padding: 40px;
      @media (max-width: 768px) { width: 100%; }
    }

    .form-inner { width: 100%; max-width: 380px; }
    .form-top { margin-bottom: 28px; }
    .form-top h2 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -0.5px; }
    .form-top p { font-size: 14px; color: #64748b; margin: 0; }

    .password-strength { margin: -8px 0 16px; }
    .strength-bar { height: 4px; background: #e2e8f0; border-radius: 99px; margin-bottom: 6px; }
    .strength-fill { height: 100%; border-radius: 99px; transition: width 0.3s, background 0.3s; }
    .strength-fill.weak { background: #ef4444; }
    .strength-fill.fair { background: #f59e0b; }
    .strength-fill.strong { background: #10b981; }
    .strength-label { font-size: 12px; font-weight: 600; }
    .strength-label.weak { color: #ef4444; }
    .strength-label.fair { color: #f59e0b; }
    .strength-label.strong { color: #10b981; }

    .terms { font-size: 12px; color: #94a3b8; text-align: center; margin: 14px 0 0; a { color: #64748b; } }
    .switch-link { text-align: center; font-size: 14px; color: #64748b; margin: 20px 0 0; a { font-weight: 600; } }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  showPass = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  touched(f: string) { return this.form.get(f)?.touched; }

  get strengthWidth() {
    const v = this.form.get('password')?.value ?? '';
    if (v.length < 6) return '33%';
    if (v.length < 10 || !/[A-Z]/.test(v) || !/[0-9]/.test(v)) return '66%';
    return '100%';
  }

  get strengthClass() {
    const v = this.form.get('password')?.value ?? '';
    if (v.length < 6) return 'weak';
    if (v.length < 10 || !/[A-Z]/.test(v) || !/[0-9]/.test(v)) return 'fair';
    return 'strong';
  }

  get strengthLabel() {
    return { weak: 'Weak', fair: 'Fair', strong: 'Strong' }[this.strengthClass];
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/patient/dashboard']),
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Email may already be in use.';
      }
    });
  }
}
