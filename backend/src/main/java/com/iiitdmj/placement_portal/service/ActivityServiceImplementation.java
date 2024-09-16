package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.ActivityDTO;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.repository.ActivityRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityServiceImplementation implements ActivityService {
    @Autowired
    private final ActivityRepository activityRepository;

    public ActivityServiceImplementation(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public Activity addActivity(Activity activity) {
        activity.setCreatedAt(LocalDateTime.now());
        activity.setLastUpdated(LocalDateTime.now());
        return activityRepository.save(activity);
    }

    @Override
    public List<Activity> getAllActivites() {
        return activityRepository.findAll();
    }

    @Override
    public Activity updateActivity(ActivityDTO updateActivity, Integer id) {
        Activity currentActivity = activityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found with id: " + id));
        currentActivity.setLastUpdated(LocalDateTime.now());
        currentActivity.setStatus(updateActivity.getStatus());
        currentActivity.setDescription(updateActivity.getDescription());

        return activityRepository.save(currentActivity) ;
    }
}
