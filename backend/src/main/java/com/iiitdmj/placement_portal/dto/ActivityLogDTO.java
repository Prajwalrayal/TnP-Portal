package com.iiitdmj.placement_portal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityLogDTO {
    @NotNull
    private String log;

    @NotNull
    private Integer activityId;
}
