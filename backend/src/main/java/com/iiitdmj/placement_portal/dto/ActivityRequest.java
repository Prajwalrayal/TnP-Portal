package com.iiitdmj.placement_portal.dto;

import com.iiitdmj.placement_portal.constants.Status;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRequest {
    @NotNull
    private String description;
    @NotNull
    private Status status;
    private Integer companyId;
    private String userEmail;

}


