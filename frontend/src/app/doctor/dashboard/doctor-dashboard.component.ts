import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Appointment } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="app-shell">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon"><mat-icon>local_hospital</mat-icon></div>
          <div class="logo-text">
            <h3>MediBook</h3>
            <p>Doctor Portal</p>
          </div>
        </div>

        <div class="sidebar-section"><label>Main</label></div>
        <a class="nav-item active">
          <mat-icon>dashboard</mat-icon> My Schedule
        </a>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ initials }}</div>
            <div class="user-details">
              <p class="user-name">Dr. {{ userName }}</p>
              <p class="user-role">Doctor</p>
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
          <h1>My Schedule</h1>
          <p>Manage your patient appointments for today and upcoming days</p>
        </div>

        <div class="page-body">

          <!-- Stats -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon" style="background:#e8f0fe">
                <mat-icon style="color:#1a73e8">calendar_today</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ total }}</div>
                <div class="stat-label">Total</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef3e2">
                <mat-icon style="color:#f29900">hourglass_empty</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ pendingList.length }}</div>
                <div class="stat-label">Awaiting Confirmation</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e6f4ea">
                <mat-icon style="color:#1e8e3e">event_available</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ confirmedList.length }}</div>
                <div class="stat-label">Confirmed</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e3f2fd">
                <mat-icon style="color:#1565c0">done_all</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ completedList.length }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <!-- Pending section -->
          <div *ngIf="!loading && pendingList.length > 0">
            <div class="section-head" style="margin-bottom:12px">
              <div>
                <h2>Needs Confirmation</h2>
                <p>{{ pendingList.length }} appointment{{ pendingList.length !== 1 ? 's' : '' }} waiting for your response</p>
              </div>
            </div>
            <div class="appt-grid" style="margin-bottom:32px">
              <div class="appt-card pending-card" *ngFor="let appt of pendingList">
                <div class="appt-header">
                  <div class="doctor-info">
                    <div class="doc-avatar" style="background:#fef3e2">
                      <mat-icon style="color:#f29900">person</mat-icon>
                    </div>
                    <div>
                      <h4>{{ appt.doctorName }}</h4>
                      <p>Patient</p>
                    </div>
                  </div>
                  <span class="badge pending">PENDING</span>
                </div>
                <div class="appt-details">
                  <div class="detail-row">
                    <mat-icon>schedule</mat-icon>
                    {{ appt.appointmentDateTime | date:'EEE, MMM d · h:mm a' }}
                  </div>
                  <div class="detail-row">
                    <mat-icon>notes</mat-icon>{{ appt.reason }}
                  </div>
                </div>
                <div class="appt-actions">
                  <button class="btn-sm success" (click)="confirm(appt.id)" [disabled]="confirming === appt.id">
                    <mat-icon>check_circle</mat-icon>
                    {{ confirming === appt.id ? 'Confirming…' : 'Confirm' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- All appointments -->
          <div class="section-head">
            <div>
              <h2>All Appointments</h2>
              <p>{{ appointments.length }} total</p>
            </div>
          </div>

          <div class="loading-wrap" *ngIf="loading">
            <div class="loading-spinner"></div>
            <span>Loading schedule…</span>
          </div>

          <div class="empty-state" *ngIf="!loading && appointments.length === 0">
            <div class="empty-icon"><mat-icon>event_available</mat-icon></div>
            <h3>No appointments yet</h3>
            <p>Patients will book appointments and they'll appear here</p>
          </div>

          <div class="appt-grid" *ngIf="!loading && appointments.length > 0">
            <div class="appt-card" *ngFor="let appt of appointments">
              <div class="appt-header">
                <div class="doctor-info">
                  <div class="doc-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div>
                    <h4>{{ appt.doctorName }}</h4>
                    <p>Patient</p>
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
                  <mat-icon>notes</mat-icon>{{ appt.reason }}
                </div>
              </div>
              <div class="appt-actions" *ngIf="appt.status === 'PENDING'">
                <button class="btn-sm success" (click)="confirm(appt.id)" [disabled]="confirming === appt.id">
                  <mat-icon>check_circle</mat-icon> Confirm
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .pending-card { border-left: 3px solid #f29900; }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  confirming: number | null = null;
  userName = '';
  initials = '';

  get total()         { return this.appointments.length; }
  get pendingList()   { return this.appointments.filter(a => a.status === 'PENDING'); }
  get confirmedList() { return this.appointments.filter(a => a.status === 'CONFIRMED'); }
  get completedList() { return this.appointments.filter(a => a.status === 'COMPLETED'); }

  constructor(private auth: AuthService, private apptService: AppointmentService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.userName = user?.fullName ?? 'Doctor';
    this.initials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
