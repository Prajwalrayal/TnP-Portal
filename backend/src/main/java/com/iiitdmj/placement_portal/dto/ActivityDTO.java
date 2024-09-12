package com.iiitdmj.placement_portal.dto;

import com.iiitdmj.placement_portal.entity.Company;
import com.iiitdmj.placement_portal.entity.Status;
import com.iiitdmj.placement_portal.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDTO {
    @NotNull
    private String description;
    @NotNull
    private Status status;
}


