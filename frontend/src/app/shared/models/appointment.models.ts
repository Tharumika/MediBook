export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  available: boolean;
}

export interface Appointment {
  id: number;
  doctorName: string;
  specialization: string;
  appointmentDateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason: string;
  notes?: string;
  bookedAt: string;
}

export interface BookAppointmentRequest {
  doctorId: number;
  appointmentDateTime: string;
  reason: string;
}
