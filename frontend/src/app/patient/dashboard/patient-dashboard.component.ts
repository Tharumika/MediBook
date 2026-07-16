import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Appointment } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="app-shell">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon"><mat-icon>local_hospital</mat-icon></div>
          <div class="logo-text">
            <h3>MediBook</h3>
            <p>Patient Portal</p>
          </div>
        </div>

        <div class="sidebar-section">
          <label>Main</label>
        </div>
        <a class="nav-item active" routerLink="/patient/dashboard">
          <mat-icon>dashboard</mat-icon> Dashboard
        </a>
        <a class="nav-item" routerLink="/patient/book">
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
          <h1>Dashboard</h1>
          <p>Track and manage your appointments</p>
        </div>

        <div class="page-body">

          <!-- Stats -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon" style="background:#e8f0fe">
                <mat-icon style="color:#1a73e8">calendar_month</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ total }}</div>
                <div class="stat-label">Total Appointments</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef3e2">
                <mat-icon style="color:#f29900">pending</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ pending }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e6f4ea">
                <mat-icon style="color:#1e8e3e">check_circle</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ confirmed }}</div>
                <div class="stat-label">Confirmed</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e3f2fd">
                <mat-icon style="color:#1565c0">task_alt</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ completed }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <!-- Appointments section -->
          <div class="section-head">
            <div>
              <h2>My Appointments</h2>
              <p>{{ appointments.length }} appointment{{ appointments.length !== 1 ? 's' : '' }} total</p>
            </div>
            <a class="btn-primary" routerLink="/patient/book" style="width:auto;padding:0 20px;font-size:14px;text-decoration:none">
              <mat-icon style="font-size:18px;width:18px;height:18px">add</mat-icon> Book New
            </a>
          </div>

          <!-- Loading -->
          <div class="loading-wrap" *ngIf="loading">
            <div class="loading-spinner"></div>
            <span>Loading appointments…</span>
          </div>

          <!-- Empty -->
          <div class="empty-state" *ngIf="!loading && appointments.length === 0">
            <div class="empty-icon"><mat-icon>event_busy</mat-icon></div>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to get started</p>
            <a class="btn-primary" routerLink="/patient/book" style="width:auto;padding:0 24px;text-decoration:none;display:inline-flex">
              Book Now
            </a>
          </div>

          <!-- Cards -->
          <div class="appt-grid" *ngIf="!loading && appointments.length > 0">
            <div class="appt-card" *ngFor="let appt of appointments">
              <div class="appt-header">
                <div class="doctor-info">
                  <div class="doc-avatar"><mat-icon>medical_services</mat-icon></div>
                  <div>
                    <h4>Dr. {{ appt.doctorName }}</h4>
                    <p>{{ appt.specialization }}</p>
                  </div>
                </div>
                <span class="badge {{ appt.status.toLowerCase() }}">{{ appt.status }}</span>
              </div>

              <div class="appt-details">
                <div class="detail-row">
                  <mat-icon>schedule</mat-icon>
                  {{ appt.appointmentDateTime | date:'EEE, MMM d · h:mm a' }}
                </div>
                <div class="detail-row">
                  <mat-icon>notes</mat-icon>
                  {{ appt.reason }}
                </div>
                <div class="detail-row" *ngIf="appt.notes">
                  <mat-icon>comment</mat-icon>
                  {{ appt.notes }}
                </div>
              </div>

              <div class="appt-actions" *ngIf="appt.status === 'PENDING' || appt.status === 'CONFIRMED'">
                <button class="btn-sm danger" (click)="cancel(appt.id)" [disabled]="cancelling === appt.id">
                  <mat-icon>cancel</mat-icon>
                  {{ cancelling === appt.id ? 'Cancelling…' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  cancelling: number | null = null;
  userName = '';
  initials = '';

  get total()     { return this.appointments.length; }
  get pending()   { return this.appointments.filter(a => a.status === 'PENDING').length; }
  get confirmed() { return this.appointments.filter(a => a.status === 'CONFIRMED').length; }
  get completed() { return this.appointments.filter(a => a.status === 'COMPLETED').length; }

  constructor(private auth: AuthService, private apptService: AppointmentService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.userName = user?.fullName ?? 'Patient';
    this.initials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
