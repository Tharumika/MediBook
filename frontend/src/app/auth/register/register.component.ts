import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <span class="logo">🏥 MediBook</span>
          </mat-card-title>
          <mat-card-subtitle>Create your patient account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" placeholder="John Doe">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="form.get('fullName')?.hasError('required')">Full name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">Min 8 characters</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</div>

            <button mat-raised-button color="primary" class="full-width submit-btn" type="submit" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Create Account</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="center">Already have an account? <a routerLink="/login">Sign in</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      padding: 16px;
    }
    .auth-card { width: 100%; max-width: 420px; padding: 24px; }
    .logo { font-size: 1.4rem; font-weight: 700; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .submit-btn { height: 48px; margin-top: 8px; }
    .error-banner {
      background: #ffebee;
      color: #c62828;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.875rem;
    }
    .center { text-align: center; width: 100%; }
    mat-card-actions { padding: 0 16px 16px; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit() {
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
