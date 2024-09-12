package com.iiitdmj.placement_portal.controller;

import com.iiitdmj.placement_portal.dto.ActivityDTO;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    @Autowired
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }
    @GetMapping("/")
    public List<Activity> getAllActivities() {
        return activityService.getAllActivites();
    }
    @PostMapping("/")
    public Activity addActivity(@Valid @RequestBody Activity activity) {
        return activityService.addActivity(activity);
    }
    @PutMapping("/{id}")
    public Activity updateActivity(@Valid @RequestBody ActivityDTO activity, @PathVariable Integer id) {
        return activityService.updateActivity(activity,id);
    }


}
