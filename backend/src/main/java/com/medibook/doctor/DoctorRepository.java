package com.medibook.doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(Specialization specialization);
    List<Doctor> findByAvailableTrue();
    Optional<Doctor> findByUserId(Long userId);
}
