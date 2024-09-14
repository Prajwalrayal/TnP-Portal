package com.iiitdmj.placement_portal.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class AuthResponse {
    @NonNull
    private final String token;
    public AuthResponse(@NonNull String token) {
        this.token = token;
    }
}
