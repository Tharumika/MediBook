import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
      <span style="margin-left:8px">MediBook — Doctor Portal</span>
      <span class="spacer"></span>
      <span class="username">Dr. {{ userName }}</span>
      <button mat-icon-button (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="page-content">
      <div class="welcome-section">
        <h2>Dr. {{ userName }}'s Schedule</h2>
        <p class="subtitle">Manage your upcoming patient appointments.</p>
      </div>

      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">{{ pending.length }}</div>
            <div class="stat-label">Pending</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card confirmed">
          <mat-card-content>
            <div class="stat-number">{{ confirmed.length }}</div>
            <div class="stat-label">Confirmed</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card completed">
          <mat-card-content>
            <div class="stat-number">{{ completed.length }}</div>
            <div class="stat-label">Completed</div>
          </mat-card-content>
        </mat-card>
      </div>

      <h3 class="section-title">Upcoming Appointments</h3>

      <div *ngIf="loading" class="spinner-wrap">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="empty-state">
        <mat-icon>event_available</mat-icon>
        <p>No appointments scheduled yet.</p>
      </div>

      <div class="appointments-grid" *ngIf="!loading && appointments.length > 0">
        <mat-card *ngFor="let appt of appointments" class="appt-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>{{ appt.doctorName }}</mat-card-title>
            <mat-card-subtitle>{{ appt.appointmentDateTime | date:'MMM d, y, h:mm a' }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p><mat-icon class="inline-icon">notes</mat-icon> {{ appt.reason }}</p>
            <mat-chip [class]="'status-' + appt.status.toLowerCase()">{{ appt.status }}</mat-chip>
          </mat-card-content>

          <mat-card-actions *ngIf="appt.status === 'PENDING'">
            <button mat-button color="primary" (click)="confirm(appt.id)" [disabled]="confirming === appt.id">
              <mat-icon>check_circle</mat-icon> Confirm
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
    .welcome-section { margin-bottom: 24px; }
    .welcome-section h2 { margin: 0 0 4px; font-size: 1.6rem; }
    .subtitle { color: #666; }
    .stats-row { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
    .stat-card { flex: 1; min-width: 120px; text-align: center; }
    .stat-card.confirmed { border-top: 4px solid #4caf50; }
    .stat-card.completed { border-top: 4px solid #2196f3; }
    .stat-number { font-size: 2rem; font-weight: 700; }
    .stat-label { color: #666; font-size: 0.85rem; }
    .section-title { font-size: 1.2rem; margin-bottom: 16px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 40px; }
    .empty-state { text-align: center; padding: 48px; color: #999; mat-icon { font-size: 48px; width: 48px; height: 48px; } }
    .appointments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .appt-card { padding: 8px; }
    .inline-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; }
    .status-pending { background: #fff3e0 !important; color: #e65100 !important; }
    .status-confirmed { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-cancelled { background: #ffebee !important; color: #c62828 !important; }
    .status-completed { background: #e3f2fd !important; color: #1565c0 !important; }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  confirming: number | null = null;
  userName = '';

  get pending() { return this.appointments.filter(a => a.status === 'PENDING'); }
  get confirmed() { return this.appointments.filter(a => a.status === 'CONFIRMED'); }
  get completed() { return this.appointments.filter(a => a.status === 'COMPLETED'); }

  constructor(private auth: AuthService, private apptService: AppointmentService) {}

  ngOnInit() {
    this.userName = this.auth.getUser()?.fullName ?? 'Doctor';
    this.apptService.getDoctorSchedule().subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  confirm(id: number) {
    this.confirming = id;
    this.apptService.confirmAppointment(id).subscribe({
      next: (updated) => {
        const idx = this.appointments.findIndex(a => a.id === id);
        if (idx !== -1) this.appointments[idx] = updated;
        this.confirming = null;
      },
      error: () => { this.confirming = null; }
    });
  }

  logout() { this.auth.logout(); }
}
