import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Doctor } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button routerLink="/patient/dashboard">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <mat-icon style="margin-left:4px">local_hospital</mat-icon>
      <span style="margin-left:8px">Book Appointment</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="page-content">
      <mat-card class="booking-card">
        <mat-card-header>
          <mat-card-title>Schedule a Visit</mat-card-title>
          <mat-card-subtitle>Choose a doctor and your preferred time</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loadingDoctors" class="spinner-wrap">
            <mat-spinner diameter="32"></mat-spinner>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loadingDoctors">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Doctor</mat-label>
              <mat-select formControlName="doctorId">
                <mat-option *ngFor="let doc of doctors" [value]="doc.id">
                  Dr. {{ doc.fullName }} — {{ doc.specialization | titlecase }} (${{ doc.consultationFee }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('doctorId')?.hasError('required')">Please select a doctor</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Appointment Date & Time</mat-label>
              <input matInput type="datetime-local" formControlName="appointmentDateTime" [min]="minDate">
              <mat-icon matSuffix>event</mat-icon>
              <mat-error *ngIf="form.get('appointmentDateTime')?.hasError('required')">Date and time required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason for Visit</mat-label>
              <textarea matInput formControlName="reason" rows="3" placeholder="Describe your symptoms or reason for visit..."></textarea>
              <mat-error *ngIf="form.get('reason')?.hasError('required')">Please describe your reason</mat-error>
            </mat-form-field>

            <div *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</div>

            <div class="actions">
              <button mat-stroked-button type="button" routerLink="/patient/dashboard">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Book Appointment</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .spacer { flex: 1; }
    .page-content { max-width: 600px; margin: 32px auto; padding: 0 16px; }
    .booking-card { padding: 8px; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 32px; }
    .error-banner {
      background: #ffebee;
      color: #c62828;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.875rem;
    }
    .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class BookAppointmentComponent implements OnInit {
  form: FormGroup;
  doctors: Doctor[] = [];
  loadingDoctors = true;
  loading = false;
  errorMsg = '';
  minDate = new Date().toISOString().slice(0, 16);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private apptService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      doctorId: ['', Validators.required],
      appointmentDateTime: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.apptService.getDoctors().subscribe({
      next: (docs) => { this.doctors = docs.filter(d => d.available); this.loadingDoctors = false; },
      error: () => { this.loadingDoctors = false; }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const val = this.form.value;
    this.apptService.bookAppointment({
      doctorId: val.doctorId,
      appointmentDateTime: val.appointmentDateTime + ':00',
      reason: val.reason
    }).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to book appointment. Please try again.';
      }
    });
  }

  logout() { this.auth.logout(); }
}
