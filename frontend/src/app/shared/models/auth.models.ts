export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface DoctorRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: string;
}
