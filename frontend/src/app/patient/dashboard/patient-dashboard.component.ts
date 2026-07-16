import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Appointment } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>local_hospital</mat-icon>
      <span style="margin-left:8px">MediBook</span>
      <span class="spacer"></span>
      <span class="username">{{ userName }}</span>
      <button mat-icon-button (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="page-content">
      <div class="welcome-section">
        <h2>Welcome back, {{ userName }}!</h2>
        <p class="subtitle">Manage your appointments and health records.</p>
        <button mat-raised-button color="primary" routerLink="/patient/book">
          <mat-icon>add</mat-icon> Book New Appointment
        </button>
      </div>

      <h3 class="section-title">My Appointments</h3>

      <div *ngIf="loading" class="spinner-wrap">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="empty-state">
        <mat-icon>event_busy</mat-icon>
        <p>No appointments yet. Book your first one!</p>
        <button mat-stroked-button color="primary" routerLink="/patient/book">Book Now</button>
      </div>

      <div class="appointments-grid" *ngIf="!loading && appointments.length > 0">
        <mat-card *ngFor="let appt of appointments" class="appt-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>medical_services</mat-icon>
            <mat-card-title>Dr. {{ appt.doctorName }}</mat-card-title>
            <mat-card-subtitle>{{ appt.specialization }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p><mat-icon class="inline-icon">schedule</mat-icon> {{ appt.appointmentDateTime | date:'MMM d, y, h:mm a' }}</p>
            <p><mat-icon class="inline-icon">notes</mat-icon> {{ appt.reason }}</p>
            <mat-chip [class]="'status-' + appt.status.toLowerCase()">{{ appt.status }}</mat-chip>
          </mat-card-content>

          <mat-card-actions *ngIf="appt.status === 'PENDING' || appt.status === 'CONFIRMED'">
            <button mat-button color="warn" (click)="cancel(appt.id)" [disabled]="cancelling === appt.id">
              <mat-icon>cancel</mat-icon> Cancel
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .spacer { flex: 1; }
    .username { margin-right: 8px; font-size: 0.9rem; }
    .page-content { max-width: 960px; margin: 24px auto; padding: 0 16px; }
    .welcome-section { margin-bottom: 32px; }
    .welcome-section h2 { margin: 0 0 4px; font-size: 1.6rem; }
    .subtitle { color: #666; margin-bottom: 16px; }
    .section-title { font-size: 1.2rem; margin-bottom: 16px; color: #333; }
    .spinner-wrap { display: flex; justify-content: center; padding: 40px; }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #999;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
    }
    .appointments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .appt-card { padding: 8px; }
    .inline-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; }
    .status-pending { background: #fff3e0 !important; color: #e65100 !important; }
    .status-confirmed { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-cancelled { background: #ffebee !important; color: #c62828 !important; }
    .status-completed { background: #e3f2fd !important; color: #1565c0 !important; }
  `]
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  cancelling: number | null = null;
  userName = '';

  constructor(private auth: AuthService, private apptService: AppointmentService) {}

  ngOnInit() {
    this.userName = this.auth.getUser()?.fullName ?? 'Patient';
    this.apptService.getMyAppointments().subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cancel(id: number) {
    this.cancelling = id;
    this.apptService.cancelAppointment(id).subscribe({
      next: (updated) => {
        const idx = this.appointments.findIndex(a => a.id === id);
        if (idx !== -1) this.appointments[idx] = updated;
        this.cancelling = null;
      },
      error: () => { this.cancelling = null; }
    });
  }

  logout() { this.auth.logout(); }
}
