package com.medibook.auth;

import com.medibook.doctor.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DoctorRegisterRequest {
    @NotBlank
    private String fullName;
    
    @Email @NotBlank
    private String email;
    
    @NotBlank @Size(min = 8)
    private String password;
    
    @NotNull
    private Specialization specialization;
    
    @NotBlank
    private String qualifications;
    
    @NotNull
    private Integer experienceYears;
    
    @NotBlank
    private String consultationFee;
}
