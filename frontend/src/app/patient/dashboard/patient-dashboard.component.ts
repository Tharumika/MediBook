import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Appointment, Doctor } from '../../shared/models/appointment.models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="app-shell">

      <!-- ── Sidebar ── -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <img src="assets/logo.png" alt="MediBook" class="sidebar-logo-img">
          <div class="logo-text">
            <h3>MediBook</h3>
            <p>Patient Portal</p>
          </div>
        </div>
        <div class="sidebar-section"><label>Main</label></div>
        <a class="nav-item active"><mat-icon>dashboard</mat-icon> Dashboard</a>
        <a class="nav-item" (click)="openBooking()" style="cursor:pointer">
          <mat-icon>add_circle_outline</mat-icon> Book Appointment
        </a>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ initials }}</div>
            <div class="user-details">
              <p class="user-name">{{ userName }}</p>
              <p class="user-role">Patient</p>
            </div>
            <button class="logout-btn" (click)="logout()"><mat-icon>logout</mat-icon></button>
          </div>
        </div>
      </aside>

      <!-- ── Main content ── -->
      <div class="main-content">
        <div class="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Track and manage your appointments</p>
          </div>
          <button class="book-btn" (click)="openBooking()">
            <mat-icon>add</mat-icon> Book New Appointment
          </button>
        </div>

        <div class="page-body">

          <!-- Stats -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon" style="background:#e8f0fe"><mat-icon style="color:#1a73e8">calendar_month</mat-icon></div>
              <div class="stat-info">
                <div class="stat-value">{{ total }}</div>
                <div class="stat-label">Total</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef3e2"><mat-icon style="color:#f29900">pending</mat-icon></div>
              <div class="stat-info">
                <div class="stat-value">{{ pendingCount }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e6f4ea"><mat-icon style="color:#1e8e3e">check_circle</mat-icon></div>
              <div class="stat-info">
                <div class="stat-value">{{ confirmedCount }}</div>
                <div class="stat-label">Confirmed</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#e3f2fd"><mat-icon style="color:#1565c0">task_alt</mat-icon></div>
              <div class="stat-info">
                <div class="stat-value">{{ completedCount }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <!-- Appointments -->
          <div class="section-head">
            <div>
              <h2>My Appointments</h2>
              <p>{{ appointments.length }} appointment{{ appointments.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>

          <div class="loading-wrap" *ngIf="loading">
            <div class="loading-spinner"></div><span>Loading…</span>
          </div>

          <div class="empty-state" *ngIf="!loading && appointments.length === 0">
            <div class="empty-icon"><mat-icon>event_busy</mat-icon></div>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to get started</p>
            <button class="btn-primary" (click)="openBooking()" style="width:auto;padding:0 24px">Book Now</button>
          </div>

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
                <div class="detail-row"><mat-icon>schedule</mat-icon>{{ appt.appointmentDateTime | date:'EEE, MMM d · h:mm a' }}</div>
                <div class="detail-row"><mat-icon>notes</mat-icon>{{ appt.reason }}</div>
              </div>
              <div class="appt-actions" *ngIf="appt.status === 'PENDING' || appt.status === 'CONFIRMED'">
                <button class="btn-sm danger" (click)="cancel(appt.id)" [disabled]="cancelling === appt.id">
                  <mat-icon>cancel</mat-icon>{{ cancelling === appt.id ? 'Cancelling…' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ══════════════════════════════════════
           GLASSMORPHISM BOOKING PANEL
      ══════════════════════════════════════ -->
      <div class="booking-overlay" [class.open]="panelOpen" (click)="closeOnBackdrop($event)">

        <div class="booking-panel glass-panel" [class.open]="panelOpen">

          <!-- Panel header -->
          <div class="panel-header">
            <div class="panel-title">
              <div class="panel-icon"><mat-icon>medical_services</mat-icon></div>
              <div>
                <h2>New Appointment</h2>
                <p>Step {{ bookingStep }} of 2</p>
              </div>
            </div>
            <button class="close-btn" (click)="closeBooking()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Step indicator -->
          <div class="step-indicator">
            <div class="step-dot" [class.active]="bookingStep >= 1" [class.done]="bookingStep > 1">
              <mat-icon *ngIf="bookingStep > 1">check</mat-icon>
              <span *ngIf="bookingStep <= 1">1</span>
            </div>
            <div class="step-line" [class.done]="bookingStep > 1"></div>
            <div class="step-dot" [class.active]="bookingStep >= 2">
              <span>2</span>
            </div>
          </div>

          <!-- ── STEP 1: Choose doctor ── -->
          <div class="panel-body" *ngIf="bookingStep === 1">
            <h3 class="step-title">Choose your doctor</h3>
            <p class="step-sub">{{ doctors.length }} specialists available</p>

            <div class="loading-wrap" *ngIf="loadingDoctors" style="padding:32px 0">
              <div class="loading-spinner"></div><span>Loading doctors…</span>
            </div>

            <div class="doctor-list" *ngIf="!loadingDoctors">
              <div class="glass-doctor-card"
                   *ngFor="let doc of doctors"
                   (click)="pickDoctor(doc)"
                   [class.picked]="selectedDoctor?.id === doc.id">

                <div class="glass-doc-avatar">
                  <mat-icon>person</mat-icon>
                </div>

                <div class="glass-doc-info">
                  <h4>Dr. {{ doc.fullName }}</h4>
                  <span class="spec-tag">{{ doc.specialization | titlecase }}</span>
                  <p class="quals">{{ doc.qualifications }}</p>
                  <div class="doc-badges">
                    <span class="doc-badge"><mat-icon>work_history</mat-icon>{{ doc.experienceYears }} yrs</span>
                    <span class="doc-badge fee"><mat-icon>payments</mat-icon>${{ doc.consultationFee }}</span>
                  </div>
                </div>

                <div class="pick-check" *ngIf="selectedDoctor?.id === doc.id">
                  <mat-icon>check_circle</mat-icon>
                </div>
              </div>
            </div>

            <div class="panel-footer">
              <button class="glass-btn secondary" (click)="closeBooking()">Cancel</button>
              <button class="glass-btn primary" [disabled]="!selectedDoctor" (click)="bookingStep = 2">
                Continue <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </div>

          <!-- ── STEP 2: Date + reason ── -->
          <div class="panel-body" *ngIf="bookingStep === 2">
            <!-- Selected doctor pill -->
            <div class="selected-doctor-pill">
              <div class="pill-avatar"><mat-icon>person</mat-icon></div>
              <div>
                <p class="pill-name">Dr. {{ selectedDoctor?.fullName }}</p>
                <p class="pill-spec">{{ selectedDoctor?.specialization | titlecase }}</p>
              </div>
              <button class="pill-change" (click)="bookingStep = 1">Change</button>
            </div>

            <form [formGroup]="bookForm" (ngSubmit)="submitBooking()">
              <h3 class="step-title" style="margin-top:20px">Schedule details</h3>

              <div class="glass-field">
                <label>Date & Time</label>
                <div class="glass-input" [class.err]="bTouched('appointmentDateTime') && bookForm.get('appointmentDateTime')?.invalid">
                  <mat-icon>event</mat-icon>
                  <input type="datetime-local" formControlName="appointmentDateTime" [min]="minDate">
                </div>
                <span class="f-error" *ngIf="bTouched('appointmentDateTime') && bookForm.get('appointmentDateTime')?.invalid">Required</span>
              </div>

              <div class="glass-field">
                <label>Reason for visit</label>
                <div class="glass-input glass-textarea" [class.err]="bTouched('reason') && bookForm.get('reason')?.invalid">
                  <mat-icon style="align-self:flex-start;margin-top:10px">notes</mat-icon>
                  <textarea formControlName="reason" rows="3" placeholder="Describe your symptoms…"></textarea>
                </div>
                <span class="f-error" *ngIf="bTouched('reason') && bookForm.get('reason')?.invalid">Required</span>
              </div>

              <!-- Fee summary -->
              <div class="fee-card">
                <div class="fee-row">
                  <span>Consultation fee</span>
                  <strong>${{ selectedDoctor?.consultationFee }}</strong>
                </div>
                <div class="fee-row total">
                  <span>Total</span>
                  <strong>${{ selectedDoctor?.consultationFee }}</strong>
                </div>
              </div>

              <div class="error-banner" *ngIf="bookError">
                <mat-icon>error_outline</mat-icon>{{ bookError }}
              </div>

              <div class="panel-footer">
                <button type="button" class="glass-btn secondary" (click)="bookingStep = 1">
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button type="submit" class="glass-btn primary" [disabled]="bookingLoading || bookForm.invalid">
                  <span class="spin" *ngIf="bookingLoading"></span>
                  <span *ngIf="!bookingLoading">Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>

          <!-- ── SUCCESS ── -->
          <div class="panel-body success-body" *ngIf="bookingStep === 3">
            <div class="success-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h3>Appointment Booked!</h3>
            <p>Your appointment with Dr. {{ selectedDoctor?.fullName }} has been submitted and is pending confirmation.</p>
            <button class="glass-btn primary" (click)="closeBooking()" style="width:100%;justify-content:center;margin-top:12px">
              Done
            </button>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Header book button ── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 20px 32px;
      h1 { font-size: 22px; font-weight: 700; margin: 0 0 2px; }
      p { font-size: 14px; color: var(--text-muted); margin: 0; }
    }

    .book-btn {
      display: inline-flex; align-items: center; gap: 6px;
      height: 42px; padding: 0 20px;
      background: var(--primary); color: #fff;
      border: none; border-radius: 10px;
      font-family: inherit; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
      box-shadow: 0 2px 8px rgba(26,115,232,0.35);
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,115,232,0.45); }
    }

    /* ══════════════════════════════════════
       OVERLAY + GLASS PANEL
    ══════════════════════════════════════ */
    .booking-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(10, 15, 30, 0);
      backdrop-filter: blur(0px);
      pointer-events: none;
      transition: background 0.35s ease, backdrop-filter 0.35s ease;

      &.open {
        background: rgba(10, 15, 30, 0.65);
        backdrop-filter: blur(6px);
        pointer-events: all;
      }
    }

    .booking-panel {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 480px;
      max-width: 100vw;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
      overflow: hidden;

      &.open { transform: translateX(0); }
    }

    /* ── Glassmorphism ── */
    .glass-panel {
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(28px) saturate(160%);
      -webkit-backdrop-filter: blur(28px) saturate(160%);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.4);
    }

    /* Panel header */
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
    }

    .panel-title {
      display: flex; align-items: center; gap: 14px;
      h2 { font-size: 18px; font-weight: 700; color: #f1f5f9; margin: 0 0 2px; }
      p { font-size: 12px; color: #64748b; margin: 0; }
    }

    .panel-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: rgba(26,115,232,0.2);
      border: 1px solid rgba(26,115,232,0.3);
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #60a5fa; font-size: 22px; }
    }

    .close-btn {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
      mat-icon { font-size: 20px; }
      &:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }
    }

    /* Step indicator */
    .step-indicator {
      display: flex; align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      flex-shrink: 0;
    }

    .step-dot {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.06);
      border: 1.5px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #64748b;
      transition: all 0.25s;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }

      &.active { background: rgba(26,115,232,0.25); border-color: #1a73e8; color: #60a5fa; }
      &.done   { background: rgba(30,142,62,0.25);  border-color: #1e8e3e; color: #4ade80; }
    }

    .step-line {
      flex: 1; height: 1.5px;
      background: rgba(255,255,255,0.1);
      margin: 0 10px;
      transition: background 0.3s;
      &.done { background: rgba(30,142,62,0.5); }
    }

    /* Panel body */
    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
    }

    .step-title { font-size: 15px; font-weight: 700; color: #e2e8f0; margin: 0 0 4px; }
    .step-sub   { font-size: 13px; color: #64748b; margin: 0 0 16px; }

    /* Doctor list */
    .doctor-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

    .glass-doctor-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 16px;
      background: rgba(255,255,255,0.04);
      border: 1.5px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.18s;
      position: relative;

      &:hover {
        background: rgba(26,115,232,0.1);
        border-color: rgba(26,115,232,0.4);
        transform: translateX(3px);
      }

      &.picked {
        background: rgba(26,115,232,0.15);
        border-color: rgba(26,115,232,0.6);
      }
    }

    .glass-doc-avatar {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: rgba(26,115,232,0.2);
      border: 1px solid rgba(26,115,232,0.3);
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #60a5fa; font-size: 24px; }
    }

    .glass-doc-info {
      flex: 1; min-width: 0;
      h4 { font-size: 14px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; }
      .quals { font-size: 11px; color: #475569; margin: 4px 0 8px; }
    }

    .spec-tag {
      display: inline-block;
      font-size: 11px; font-weight: 600;
      color: #60a5fa;
      background: rgba(26,115,232,0.15);
      border: 1px solid rgba(26,115,232,0.25);
      padding: 2px 8px; border-radius: 99px;
    }

    .doc-badges {
      display: flex; gap: 8px;
      .doc-badge {
        display: inline-flex; align-items: center; gap: 3px;
        font-size: 11px; color: #64748b;
        mat-icon { font-size: 12px; width: 12px; height: 12px; }
        &.fee { color: #34d399; }
      }
    }

    .pick-check {
      position: absolute; top: 12px; right: 12px;
      mat-icon { color: #60a5fa; font-size: 22px; }
    }

    /* Selected doctor pill */
    .selected-doctor-pill {
      display: flex; align-items: center; gap: 12px;
      background: rgba(26,115,232,0.12);
      border: 1px solid rgba(26,115,232,0.3);
      border-radius: 12px; padding: 12px 14px;

      .pill-avatar {
        width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
        background: rgba(26,115,232,0.2);
        display: flex; align-items: center; justify-content: center;
        mat-icon { color: #60a5fa; font-size: 22px; }
      }

      .pill-name { font-size: 14px; font-weight: 700; color: #e2e8f0; margin: 0 0 2px; }
      .pill-spec { font-size: 12px; color: #60a5fa; margin: 0; }

      .pill-change {
        margin-left: auto; font-size: 12px; font-weight: 600; color: #60a5fa;
        background: rgba(26,115,232,0.15); border: 1px solid rgba(26,115,232,0.3);
        border-radius: 7px; padding: 4px 10px; cursor: pointer; font-family: inherit;
        transition: all 0.15s;
        &:hover { background: rgba(26,115,232,0.25); }
      }
    }

    /* Glass form fields */
    .glass-field {
      margin-bottom: 18px;
      label { display: block; font-size: 12px; font-weight: 600; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 7px; }
    }

    .glass-input {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.05);
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 0 14px; height: 48px;
      transition: all 0.15s;

      mat-icon { color: #475569; font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }

      input, textarea {
        flex: 1; background: none; border: none; outline: none;
        font-family: inherit; font-size: 14px; color: #e2e8f0;
        &::placeholder { color: #334155; }
        color-scheme: dark;
      }

      &:focus-within {
        border-color: rgba(26,115,232,0.6);
        background: rgba(26,115,232,0.08);
        box-shadow: 0 0 0 3px rgba(26,115,232,0.12);
      }

      &.err { border-color: rgba(239,68,68,0.5); }
    }

    .glass-textarea {
      height: auto; padding: 10px 14px; align-items: flex-start;
      textarea { resize: none; line-height: 1.5; padding-top: 2px; }
    }

    .f-error { font-size: 11px; color: #f87171; margin-top: 4px; display: block; }

    /* Fee card */
    .fee-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px; padding: 14px 16px; margin-bottom: 18px;
    }

    .fee-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px; padding: 5px 0;
      span { color: #64748b; }
      strong { color: #94a3b8; }
      &.total {
        border-top: 1px solid rgba(255,255,255,0.07);
        margin-top: 6px; padding-top: 10px;
        strong { color: #34d399; font-size: 16px; }
      }
    }

    /* Panel footer */
    .panel-footer {
      display: flex; gap: 10px; justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-top: 4px;
      flex-shrink: 0;
    }

    .glass-btn {
      height: 44px; padding: 0 20px; border-radius: 10px;
      font-family: inherit; font-size: 14px; font-weight: 600;
      cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
      transition: all 0.18s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &.primary {
        background: #1a73e8;
        border: 1px solid rgba(255,255,255,0.12);
        color: #fff;
        box-shadow: 0 2px 12px rgba(26,115,232,0.4);
        &:hover:not(:disabled) { background: #1558b0; box-shadow: 0 4px 16px rgba(26,115,232,0.5); }
        &:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
      }

      &.secondary {
        background: rgba(255,255,255,0.06);
        border: 1.5px solid rgba(255,255,255,0.1);
        color: #94a3b8;
        &:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
      }
    }

    /* Success state */
    .success-body {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center; gap: 12px; padding: 40px 24px;
    }

    .success-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(30,142,62,0.15);
      border: 2px solid rgba(30,142,62,0.4);
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 42px; width: 42px; height: 42px; color: #4ade80; }
      animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }

    .success-body h3 { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 0; }
    .success-body p  { font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; max-width: 280px; }

    @keyframes pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    /* Error banner (dark version) */
    .error-banner {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.25);
      color: #f87171;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      mat-icon { font-size: 18px; }
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  loading = true;
  loadingDoctors = false;
  cancelling: number | null = null;
  userName = '';
  initials = '';

  // Booking panel state
  panelOpen = false;
  bookingStep = 1;
  selectedDoctor: Doctor | null = null;
  bookForm: FormGroup;
  bookingLoading = false;
  bookError = '';
  minDate = new Date().toISOString().slice(0, 16);

  get total()          { return this.appointments.length; }
  get pendingCount()   { return this.appointments.filter(a => a.status === 'PENDING').length; }
  get confirmedCount() { return this.appointments.filter(a => a.status === 'CONFIRMED').length; }
  get completedCount() { return this.appointments.filter(a => a.status === 'COMPLETED').length; }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private apptService: AppointmentService
  ) {
    this.bookForm = this.fb.group({
      appointmentDateTime: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = this.auth.getUser();
    this.userName = user?.fullName ?? 'Patient';
    this.initials = this.userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    this.loadAppointments();
  }

  loadAppointments() {
    this.apptService.getMyAppointments().subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openBooking() {
    this.panelOpen = true;
    this.bookingStep = 1;
    this.selectedDoctor = null;
    this.bookForm.reset();
    this.bookError = '';
    document.body.style.overflow = 'hidden';

    if (this.doctors.length === 0) {
      this.loadingDoctors = true;
      this.apptService.getDoctors().subscribe({
        next: (docs) => { this.doctors = docs.filter(d => d.available); this.loadingDoctors = false; },
        error: () => { this.loadingDoctors = false; }
      });
    }
  }

  closeBooking() {
    this.panelOpen = false;
    document.body.style.overflow = '';
    if (this.bookingStep === 3) {
      this.loadAppointments();
    }
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('booking-overlay')) {
      this.closeBooking();
    }
  }

  pickDoctor(doc: Doctor) {
    this.selectedDoctor = doc;
  }

  bTouched(f: string) { return this.bookForm.get(f)?.touched; }

  submitBooking() {
    this.bookForm.markAllAsTouched();
    if (this.bookForm.invalid || !this.selectedDoctor) return;
    this.bookingLoading = true;
    this.bookError = '';

    const val = this.bookForm.value;
    this.apptService.bookAppointment({
      doctorId: this.selectedDoctor.id,
      appointmentDateTime: val.appointmentDateTime + ':00',
      reason: val.reason
    }).subscribe({
      next: () => { this.bookingLoading = false; this.bookingStep = 3; },
      error: (err) => {
        this.bookingLoading = false;
        this.bookError = err.error?.message || 'Booking failed. Please try again.';
      }
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
