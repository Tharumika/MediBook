package com.medibook.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull
    private Long doctorId;
    @NotNull @Future
    private LocalDateTime appointmentDateTime;
    private String reason;
}
