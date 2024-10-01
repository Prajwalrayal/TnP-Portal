package com.iiitdmj.placement_portal.controller;

import com.iiitdmj.placement_portal.dto.ActivityDTO;
import com.iiitdmj.placement_portal.dto.ActivityLogDTO;
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
    public ActivityResponse addActivity(@Valid @RequestBody ActivityDTO activityDTO) {
        return activityService.addActivity(activityDTO);
    }

    @PutMapping("/{id}")
    public Activity updateActivity(@Valid @RequestBody ActivityDTO activity, @PathVariable Integer id) {
        return activityService.updateActivity(activity,id);
    }

    @PostMapping("/add-log")
    public ActivityLog addLog(@Valid @RequestBody ActivityLogDTO activityLogDTO) {
        return activityService.addLog(activityLogDTO);
    }

    @GetMapping("/logs/{id}")
    public List<ActivityLog> getLogs(@PathVariable Integer id) {
        return activityService.getLogs(id);
    }


}
