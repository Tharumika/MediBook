package com.medibook.doctor;

import com.medibook.appointment.Appointment;
import com.medibook.appointment.AppointmentRepository;
import com.medibook.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/api/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findByAvailableTrue());
    }

    @GetMapping("/api/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/doctors/specialization/{spec}")
    public ResponseEntity<List<Doctor>> getBySpecialization(@PathVariable Specialization spec) {
        return ResponseEntity.ok(doctorRepository.findBySpecialization(spec));
    }

    @GetMapping("/api/doctor/schedule")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getSchedule(@AuthenticationPrincipal User user) {
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return ResponseEntity.ok(appointmentRepository.findByDoctorIdOrderByAppointmentDateTimeAsc(doctor.getId()));
    }
}
