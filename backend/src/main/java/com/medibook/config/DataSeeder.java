package com.medibook.config;

import com.medibook.doctor.Doctor;
import com.medibook.doctor.DoctorRepository;
import com.medibook.doctor.Specialization;
import com.medibook.patient.Patient;
import com.medibook.patient.PatientRepository;
import com.medibook.user.Role;
import com.medibook.user.User;
import com.medibook.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Admin
        User admin = userRepository.save(User.builder()
                .fullName("Admin User").email("admin@medibook.com")
                .password(passwordEncoder.encode("Admin@123")).role(Role.ADMIN).build());

        // Doctor
        User docUser = userRepository.save(User.builder()
                .fullName("Dr. Sarah Perera").email("doctor@medibook.com")
                .password(passwordEncoder.encode("Doctor@123")).role(Role.DOCTOR).build());
        doctorRepository.save(Doctor.builder()
                .user(docUser).specialization(Specialization.GENERAL_PRACTICE)
                .qualifications("MBBS, MD").experienceYears(8)
                .consultationFee("2500 LKR").available(true).build());

        // Patient
        User patUser = userRepository.save(User.builder()
                .fullName("Vidun Tharumika").email("patient@medibook.com")
                .password(passwordEncoder.encode("Patient@123")).role(Role.PATIENT).build());
        patientRepository.save(Patient.builder()
                .user(patUser).gender("Male").bloodGroup("O+").build());

        log.info("Seed data loaded - admin@medibook.com / doctor@medibook.com / patient@medibook.com");
    }
}
