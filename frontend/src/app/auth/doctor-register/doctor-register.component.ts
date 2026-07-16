import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-doctor-register',
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
          <h1>Join as a Medical Professional</h1>
          <p>Deliver top-tier healthcare, manage your consultation slots, and grow your practice with MediBook.</p>
          <div class="perks">
            <div class="perk"><mat-icon>check_circle</mat-icon> Reach hundreds of local patients</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> Flexible schedule management</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> Direct patient consultations</div>
            <div class="perk"><mat-icon>check_circle</mat-icon> Professional practitioner profile</div>
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
            <h2>Doctor Registration</h2>
            <p>Set up your professional practitioner portal</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            
            <!-- Step 1: Personal Details -->
            <div *ngIf="step === 1">
              <div class="field-group">
                <label>Full Name (with Dr. prefix)</label>
                <div class="input-wrap" [class.has-error]="touched('fullName') && form.get('fullName')?.invalid">
                  <mat-icon>person_outline</mat-icon>
                  <input type="text" formControlName="fullName" placeholder="Dr. Elizabeth Blackwell" autocomplete="name">
                </div>
                <span class="field-error" *ngIf="touched('fullName') && form.get('fullName')?.hasError('required')">Name is required</span>
              </div>

              <div class="field-group">
                <label>Email Address</label>
                <div class="input-wrap" [class.has-error]="touched('email') && form.get('email')?.invalid">
                  <mat-icon>email</mat-icon>
                  <input type="email" formControlName="email" placeholder="dr.name@medibook.com" autocomplete="email">
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

              <button class="btn-primary" type="button" (click)="nextStep()" [disabled]="form.get('fullName')?.invalid || form.get('email')?.invalid || form.get('password')?.invalid">
                Next: Professional Info <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>

            <!-- Step 2: Professional Details -->
            <div *ngIf="step === 2">
              <div class="field-group">
                <label>Specialization</label>
                <div class="input-wrap" [class.has-error]="touched('specialization') && form.get('specialization')?.invalid">
                  <mat-icon>medical_services</mat-icon>
                  <select formControlName="specialization">
                    <option value="" disabled selected>Select specialization</option>
                    <option *ngFor="let spec of specializations" [value]="spec.value">{{ spec.label }}</option>
                  </select>
                </div>
                <span class="field-error" *ngIf="touched('specialization') && form.get('specialization')?.hasError('required')">Specialization is required</span>
              </div>

              <div class="field-group">
                <label>Qualifications</label>
                <div class="input-wrap" [class.has-error]="touched('qualifications') && form.get('qualifications')?.invalid">
                  <mat-icon>workspace_premium</mat-icon>
                  <input type="text" formControlName="qualifications" placeholder="e.g. MBBS, MD, FRCP">
                </div>
                <span class="field-error" *ngIf="touched('qualifications') && form.get('qualifications')?.hasError('required')">Qualifications are required</span>
              </div>

              <div class="form-row">
                <div class="field-group">
                  <label>Experience (Years)</label>
                  <div class="input-wrap" [class.has-error]="touched('experienceYears') && form.get('experienceYears')?.invalid">
                    <mat-icon>work_history</mat-icon>
                    <input type="number" formControlName="experienceYears" placeholder="e.g. 10">
                  </div>
                  <span class="field-error" *ngIf="touched('experienceYears') && form.get('experienceYears')?.hasError('required')">Required</span>
                  <span class="field-error" *ngIf="touched('experienceYears') && form.get('experienceYears')?.hasError('min')">Must be &ge; 0</span>
                </div>

                <div class="field-group">
                  <label>Consultation Fee ($)</label>
                  <div class="input-wrap" [class.has-error]="touched('consultationFee') && form.get('consultationFee')?.invalid">
                    <mat-icon>payments</mat-icon>
                    <input type="text" formControlName="consultationFee" placeholder="e.g. 150">
                  </div>
                  <span class="field-error" *ngIf="touched('consultationFee') && form.get('consultationFee')?.hasError('required')">Required</span>
                </div>
              </div>

              <div class="error-banner" *ngIf="errorMsg">
                <mat-icon>error_outline</mat-icon>{{ errorMsg }}
              </div>

              <div class="button-group">
                <button class="btn-secondary" type="button" (click)="step = 1">
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button class="btn-primary" type="submit" [disabled]="loading || form.invalid">
                  <span class="spin" *ngIf="loading"></span>
                  <span *ngIf="!loading">Submit Registration</span>
                </button>
              </div>
            </div>

          </form>

          <p class="switch-link">Registering as a patient? <a routerLink="/register">Register here</a></p>
          <p class="switch-link" style="margin-top: 10px;">Already registered? <a routerLink="/doctor-login">Doctor Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; }

    .brand-panel {
      flex: 1;
      background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #4338ca 100%);
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
    .brand-inner > p { font-size: 16px; color: #cbd5e1; margin: 0 0 36px; line-height: 1.6; }

    .perks { display: flex; flex-direction: column; gap: 14px; }
    .perk {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; color: #f1f5f9; font-weight: 500;
      mat-icon { color: #818cf8; font-size: 20px; }
    }

    .brand-graphic { position: absolute; inset: 0; pointer-events: none; }
    .circle { position: absolute; border-radius: 50%; }
    .c1 { width: 500px; height: 500px; bottom: -200px; right: -150px; background: rgba(255,255,255,0.03); }
    .c2 { width: 250px; height: 250px; top: -60px; right: 60px; background: rgba(99, 102, 241, 0.12); }

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

    .form-row {
      display: flex;
      gap: 16px;
      .field-group { flex: 1; }
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      .btn-secondary { flex: 1; }
      .btn-primary { flex: 2; }
    }

    .btn-secondary {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      height: 48px; border-radius: 10px;
      border: 1.5px solid #cbd5e1; background: #fff;
      font-family: inherit; font-size: 14px; font-weight: 600; color: #475569;
      cursor: pointer; transition: all 0.15s;
      mat-icon { font-size: 20px; }
      &:hover { background: #f1f5f9; border-color: #94a3b8; }
    }

    select {
      flex: 1; background: none; border: none; outline: none;
      font-family: inherit; font-size: 14px; color: #334155;
      cursor: pointer;
      option { color: #0f172a; }
    }

    .switch-link { text-align: center; font-size: 14px; color: #64748b; margin: 20px 0 0; a { font-weight: 600; color: #4f46e5; } }
  `]
})
export class DoctorRegisterComponent {
  form: FormGroup;
  loading = false;
  showPass = false;
  errorMsg = '';
  step = 1;

  specializations = [
    { value: 'GENERAL_PRACTICE', label: 'General Practice' },
    { value: 'CARDIOLOGY', label: 'Cardiology' },
    { value: 'DERMATOLOGY', label: 'Dermatology' },
    { value: 'NEUROLOGY', label: 'Neurology' },
    { value: 'ORTHOPEDICS', label: 'Orthopedics' },
    { value: 'PEDIATRICS', label: 'Pediatrics' },
    { value: 'PSYCHIATRY', label: 'Psychiatry' },
    { value: 'RADIOLOGY', label: 'Radiology' },
    { value: 'SURGERY', label: 'Surgery' },
    { value: 'GYNECOLOGY', label: 'Gynecology' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      specialization: ['', Validators.required],
      qualifications: ['', Validators.required],
      experienceYears: ['', [Validators.required, Validators.min(0)]],
      consultationFee: ['', Validators.required]
    });
  }

  touched(f: string) { return this.form.get(f)?.touched; }

  nextStep() {
    this.step = 2;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const payload = {
      ...this.form.value,
      // Prefix name if not already done, just in case
      fullName: this.form.value.fullName.startsWith('Dr. ') ? this.form.value.fullName : 'Dr. ' + this.form.value.fullName
    };

    this.auth.registerDoctor(payload).subscribe({
      next: () => this.router.navigate(['/doctor/dashboard']),
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Email may already be in use.';
      }
    });
  }
}
