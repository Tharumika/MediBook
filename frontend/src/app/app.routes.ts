import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'doctor-login',
    loadComponent: () => import('./auth/doctor-login/doctor-login.component').then(m => m.DoctorLoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'patient',
    canActivate: [authGuard],
    data: { role: 'PATIENT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./patient/dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
      },
      {
        path: 'book',
        loadComponent: () => import('./patient/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent)
      }
    ]
  },
  {
    path: 'doctor',
    canActivate: [authGuard],
    data: { role: 'DOCTOR' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./doctor/dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
