import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Doctor } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="app-shell">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <img src="assets/logo.png" alt="MediBook" class="sidebar-logo-img">
          <div class="logo-text">
            <h3>MediBook</h3>
            <p>Patient Portal</p>
          </div>
        </div>
        <div class="sidebar-section"><label>Main</label></div>
        <a class="nav-item" routerLink="/patient/dashboard">
          <mat-icon>dashboard</mat-icon> Dashboard
        </a>
        <a class="nav-item active">
          <mat-icon>add_circle_outline</mat-icon> Book Appointment
        </a>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ initials }}</div>
            <div class="user-details">
              <p class="user-name">{{ userName }}</p>
              <p class="user-role">Patient</p>
            </div>
            <button class="logout-btn" (click)="logout()" title="Logout">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="main-content">
        <div class="page-header">
          <h1>Book Appointment</h1>
          <p>Choose a doctor and schedule your visit</p>
        </div>

        <div class="page-body">

          <!-- Loading doctors -->
          <div class="loading-wrap" *ngIf="loadingDoctors">
            <div class="loading-spinner"></div>
            <span>Loading available doctors…</span>
          </div>

          <div class="booking-layout" *ngIf="!loadingDoctors">

            <!-- Step 1: Pick doctor -->
            <div class="step-card" [class.step-done]="selectedDoctor">
              <div class="step-header">
                <div class="step-num" [class.done]="selectedDoctor">
                  <mat-icon *ngIf="selectedDoctor">check</mat-icon>
                  <span *ngIf="!selectedDoctor">1</span>
                </div>
                <div>
                  <h3>Choose a Doctor</h3>
                  <p *ngIf="!selectedDoctor">{{ doctors.length }} doctors available</p>
                  <p *ngIf="selectedDoctor" class="selected-hint">Dr. {{ selectedDoctor.fullName }} selected</p>
                </div>
              </div>

              <div class="doctor-grid" *ngIf="!selectedDoctor">
                <div class="doctor-card" *ngFor="let doc of doctors"
                     (click)="selectDoctor(doc)"
                     [class.selected]="form.get('doctorId')?.value === doc.id">
                  <div class="doc-avatar-lg">
                    <mat-icon>medical_services</mat-icon>
                  </div>
                  <div class="doc-info">
                    <h4>Dr. {{ doc.fullName }}</h4>
                    <p class="spec">{{ doc.specialization | titlecase }}</p>
                    <p class="quals">{{ doc.qualifications }}</p>
                    <div class="doc-meta">
                      <span><mat-icon>work</mat-icon> {{ doc.experienceYears }} yrs exp</span>
                      <span class="fee"><mat-icon>payments</mat-icon> {{ '$' + doc.consultationFee }}</span>
                    </div>
                  </div>
                  <div class="select-indicator" *ngIf="form.get('doctorId')?.value === doc.id">
                    <mat-icon>check_circle</mat-icon>
                  </div>
                </div>
              </div>

              <button class="change-btn" *ngIf="selectedDoctor" (click)="selectedDoctor = null; form.patchValue({doctorId: ''})">
                <mat-icon>edit</mat-icon> Change Doctor
              </button>
            </div>

            <!-- Step 2: Date + reason -->
            <div class="step-card" [class.disabled]="!selectedDoctor">
              <div class="step-header">
                <div class="step-num" [class.active]="selectedDoctor">2</div>
                <div>
                  <h3>Appointment Details</h3>
                  <p>Choose date, time and reason for visit</p>
                </div>
              </div>

              <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="selectedDoctor">
                <div class="form-row">
                  <div class="field-group">
                    <label>Date & Time</label>
                    <div class="input-wrap" [class.has-error]="touched('appointmentDateTime') && form.get('appointmentDateTime')?.invalid">
                      <mat-icon>event</mat-icon>
                      <input type="datetime-local" formControlName="appointmentDateTime" [min]="minDate">
                    </div>
                    <span class="field-error" *ngIf="touched('appointmentDateTime') && form.get('appointmentDateTime')?.hasError('required')">Please select a date and time</span>
                  </div>
                </div>

                <div class="field-group">
                  <label>Reason for Visit</label>
                  <div class="input-wrap textarea-wrap" [class.has-error]="touched('reason') && form.get('reason')?.invalid">
                    <mat-icon style="align-self:flex-start;margin-top:12px">notes</mat-icon>
                    <textarea formControlName="reason" rows="4" placeholder="Describe your symptoms or reason for this appointment…"></textarea>
                  </div>
                  <span class="field-error" *ngIf="touched('reason') && form.get('reason')?.hasError('required')">Please describe your reason for visit</span>
                </div>

                <div class="error-banner" *ngIf="errorMsg">
                  <mat-icon>error_outline</mat-icon>{{ errorMsg }}
                </div>

                <!-- Summary box -->
                <div class="booking-summary" *ngIf="selectedDoctor">
                  <h4>Booking Summary</h4>
                  <div class="summary-row">
                    <span>Doctor</span>
                    <strong>Dr. {{ selectedDoctor.fullName }}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Specialization</span>
                    <strong>{{ selectedDoctor.specialization | titlecase }}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Consultation Fee</span>
                    <strong class="fee-highlight">{{ '$' + selectedDoctor?.consultationFee }}</strong>
                  </div>
                </div>

                <div class="form-actions">
                  <a class="btn-outline" routerLink="/patient/dashboard" style="display:inline-flex;align-items:center;gap:5px;text-decoration:none">
                    <mat-icon style="font-size:18px;width:18px;height:18px">arrow_back</mat-icon> Back
                  </a>
                  <button class="btn-primary" type="submit" [disabled]="loading || form.invalid" style="width:auto;padding:0 28px">
                    <span class="spin" *ngIf="loading"></span>
                    <span *ngIf="!loading">Confirm Booking</span>
                  </button>
                </div>
              </form>

              <div class="step-placeholder" *ngIf="!selectedDoctor">
                <mat-icon>touch_app</mat-icon>
                <p>Select a doctor above to continue</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-layout { display: flex; flex-direction: column; gap: 24px; max-width: 780px; }

    .step-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-xs);
      transition: opacity 0.2s;

      &.disabled { opacity: 0.5; pointer-events: none; }
      &.step-done { border-color: #c8e6c9; }
    }

    .step-header {
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px;

      h3 { font-size: 16px; font-weight: 700; margin: 0 0 2px; }
      p { font-size: 13px; color: var(--text-muted); margin: 0; }
      .selected-hint { color: var(--success); font-weight: 500; }
    }

    .step-num {
      width: 36px; height: 36px; border-radius: 50%;
      background: #f1f5f9; color: var(--text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; flex-shrink: 0;

      &.active { background: var(--primary-light); color: var(--primary); }
      &.done   { background: var(--success-light); color: var(--success); mat-icon { font-size: 20px; } }
    }

    .doctor-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }

    .doctor-card {
      display: flex; align-items: flex-start; gap: 14px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s;
      position: relative;

      &:hover { border-color: var(--primary); background: var(--primary-light); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
      &.selected { border-color: var(--primary); background: var(--primary-light); }
    }

    .doc-avatar-lg {
      width: 48px; height: 48px; border-radius: 12px;
      background: var(--primary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      mat-icon { color: var(--primary); font-size: 26px; }
    }

    .doc-info {
      flex: 1; min-width: 0;
      h4 { font-size: 14px; font-weight: 700; margin: 0 0 2px; }
      .spec { font-size: 12px; color: var(--primary); font-weight: 600; margin: 0 0 4px; }
      .quals { font-size: 11px; color: var(--text-muted); margin: 0 0 8px; }
    }

    .doc-meta {
      display: flex; gap: 12px; font-size: 12px; color: var(--text-muted);
      span { display: flex; align-items: center; gap: 3px; mat-icon { font-size: 14px; width: 14px; height: 14px; } }
      .fee { color: var(--success); font-weight: 600; }
    }

    .select-indicator {
      position: absolute; top: 12px; right: 12px;
      mat-icon { color: var(--primary); font-size: 22px; }
    }

    .change-btn {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 13px; color: var(--primary); background: none;
      border: 1px solid var(--primary); border-radius: 8px;
      padding: 6px 14px; cursor: pointer; font-family: inherit;
      transition: all 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: var(--primary-light); }
    }

    .form-row { margin-bottom: 4px; }

    .textarea-wrap {
      height: auto !important;
      align-items: flex-start;
      padding: 10px 14px !important;

      textarea {
        flex: 1; border: none; outline: none; resize: vertical;
        font-family: inherit; font-size: 14px; color: var(--text);
        background: transparent; line-height: 1.5; min-height: 80px;
        &::placeholder { color: var(--text-light); }
      }
    }

    .booking-summary {
      background: #f8fafc; border: 1px solid var(--border);
      border-radius: var(--radius-sm); padding: 16px; margin-bottom: 20px;
      h4 { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; }
    }

    .summary-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 6px 0; font-size: 14px;
      span { color: var(--text-muted); }
      strong { color: var(--text); }
      .fee-highlight { color: var(--success); font-size: 16px; }
      & + & { border-top: 1px solid var(--border); }
    }

    .form-actions {
      display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 8px;
    }

    .step-placeholder {
      display: flex; flex-direction: column; align-items: center;
      padding: 32px; color: var(--text-light); gap: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
      p { font-size: 14px; margin: 0; }
    }
  `]
})
export class BookAppointmentComponent implements OnInit {
  form: FormGroup;
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  loadingDoctors = true;
  loading = false;
  errorMsg = '';
  minDate = new Date().toISOString().slice(0, 16);
  userName = '';
  initials = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private apptService: AppointmentService,
    private router: Router
  ) {
    this.form = this.fb.group({
      doctorId: ['', Validators.required],
      appointmentDateTime: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = this.auth.getUser();
    this.userName = user?.fullName ?? 'Patient';
    this.initials = this.userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    this.apptService.getDoctors().subscribe({
      next: (docs) => { this.doctors = docs.filter(d => d.available); this.loadingDoctors = false; },
      error: () => { this.loadingDoctors = false; }
    });
  }

  touched(f: string) { return this.form.get(f)?.touched; }

  selectDoctor(doc: Doctor) {
    this.selectedDoctor = doc;
    this.form.patchValue({ doctorId: doc.id });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const val = this.form.value;
    this.apptService.bookAppointment({
      doctorId: val.doctorId,
      appointmentDateTime: val.appointmentDateTime + ':00',
      reason: val.reason
    }).subscribe({
      next: () => this.router.navigate(['/patient/dashboard']),
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to book. Please try again.';
      }
    });
  }

  logout() { this.auth.logout(); }
}
