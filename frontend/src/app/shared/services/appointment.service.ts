import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, BookAppointmentRequest, Doctor } from '../models/appointment.models';

const API = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api'
  : '/api';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getDoctors() {
    return this.http.get<Doctor[]>(`${API}/doctors`);
  }

  getDoctorById(id: number) {
    return this.http.get<Doctor>(`${API}/doctors/${id}`);
  }

  bookAppointment(req: BookAppointmentRequest) {
    return this.http.post<Appointment>(`${API}/appointments`, req);
  }

  getMyAppointments() {
    return this.http.get<Appointment[]>(`${API}/appointments/my`);
  }

  cancelAppointment(id: number) {
    return this.http.patch<Appointment>(`${API}/appointments/${id}/cancel`, {});
  }

  getDoctorSchedule() {
    return this.http.get<Appointment[]>(`${API}/doctor/schedule`);
  }

  confirmAppointment(id: number) {
    return this.http.patch<Appointment>(`${API}/appointments/${id}/confirm`, {});
  }
}
