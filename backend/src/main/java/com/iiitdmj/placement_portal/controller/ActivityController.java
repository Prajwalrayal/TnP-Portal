package com.iiitdmj.placement_portal.controller;

import com.iiitdmj.placement_portal.dto.ActivityRequest;
import com.iiitdmj.placement_portal.dto.ActivityLogRequest;
import com.iiitdmj.placement_portal.dto.ActivityResponse;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.entity.ActivityLog;
import com.iiitdmj.placement_portal.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@PreAuthorize("hasPermission(null, 'ROLE_TPR')")
public class ActivityController {

    @Autowired
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("")
    public List<ActivityResponse> getAllActivities() {
        return activityService.getAllActivites();
    }

    @PostMapping("")
    public ActivityResponse addActivity(@Valid @RequestBody ActivityRequest activityRequest) {
        return activityService.addActivity(activityRequest);
    }

    @PutMapping("/{id}")
    public ActivityResponse updateActivity(@Valid @RequestBody ActivityRequest activity, @PathVariable Integer id) {
        return activityService.updateActivity(activity, id);
    }

    @PostMapping("/add-log")
    public ActivityLog addLog(@Valid @RequestBody ActivityLogRequest activityLogRequestDTO) {
        return activityService.addLog(activityLogRequestDTO);
    }

    @GetMapping("/logs/{id}")
    public List<ActivityLog> getLogsByActivityId(@PathVariable Integer id) {
        return activityService.getLogsByActivityId(id);
    }

}
