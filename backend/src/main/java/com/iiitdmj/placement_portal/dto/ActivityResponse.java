package com.iiitdmj.placement_portal.dto;

import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.entity.Company;
import com.iiitdmj.placement_portal.constants.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResponse {
    private Integer id;
    private String description;
    private Status status;
    private Company company;
    private String userEmail;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    public ActivityResponse(Activity activity) {
        this.id = activity.getId();
        this.description = activity.getDescription();
        this.status = activity.getStatus();
        this.company = activity.getCompany();
        this.userEmail = activity.getUser().getEmail();
        this.userName = activity.getUser().getFirstName();
        this.createdAt = activity.getCreatedAt();
        this.lastUpdated = activity.getLastUpdated();
    }

    public static List<ActivityResponse> fromActivityList(List<Activity> activities) {
        List<ActivityResponse> activityResponses = new ArrayList<>();
        for (Activity activity : activities) {
            activityResponses.add(new ActivityResponse(activity));
        }
        return activityResponses;
    }

}
