package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.dto.ActivityRequest;
import com.iiitdmj.placement_portal.dto.ActivityLogRequest;
import com.iiitdmj.placement_portal.dto.ActivityResponse;
import com.iiitdmj.placement_portal.entity.Activity;
import com.iiitdmj.placement_portal.entity.ActivityLog;
import com.iiitdmj.placement_portal.entity.User;
import com.iiitdmj.placement_portal.repository.ActivityLogRepository;
import com.iiitdmj.placement_portal.repository.ActivityRepository;
import com.iiitdmj.placement_portal.repository.CompanyRepository;
import com.iiitdmj.placement_portal.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityServiceImplementation implements ActivityService {
    @Autowired
    private final ActivityRepository activityRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public ActivityServiceImplementation(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public List<ActivityLog> getLogsByActivityId(Integer id) {
        return activityLogRepository.findByActivityId(id);
    }

    @Override
    public ActivityLog addLog(ActivityLogRequest activityLogRequestDTO) {
        Activity activity = activityRepository.findById(activityLogRequestDTO.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        ActivityLog activityLog = new ActivityLog();
        activityLog.setLog(activityLogRequestDTO.getLog());
        activityLog.setTimestamp(LocalDateTime.now());
        activityLog.setActivity(activity);

        return activityLogRepository.save(activityLog);
    }

    @Override
    public ActivityResponse addActivity(ActivityRequest activityRequest) {
        Activity activity = new Activity();
        activity.setStatus(activityRequest.getStatus());
        activity.setDescription(activityRequest.getDescription());
        activity.setCompany(companyRepository.findById(activityRequest
                .getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Company not found with id: " + activityRequest.getCompanyId())));
        activity.setUser(userRepository.findByEmail(activityRequest.getUserEmail()));
        activity.setCreatedAt(LocalDateTime.now());
        activity.setLastUpdated(LocalDateTime.now());
        activityRepository.save(activity);

        ActivityResponse activityResponse = new ActivityResponse(
                activity.getId(),
                activity.getDescription(),
                activity.getStatus(),
                activity.getCompany(),
                activity.getUser().getEmail(),
                activity.getUser().getFirstName(),
                activity.getCreatedAt(),
                activity.getLastUpdated());

        return activityResponse;
    }

    @Override
    public List<ActivityResponse> getAllActivites() {
        List<Activity> activities = activityRepository.findAll();
        return ActivityResponse.fromActivityList(activities);
    }

    @Override
    public ActivityResponse updateActivity(ActivityRequest updateActivity, Integer id) {
        Activity currentActivity = activityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found with id: " + id));
        currentActivity.setLastUpdated(LocalDateTime.now());
        currentActivity.setStatus(updateActivity.getStatus());
        currentActivity.setDescription(updateActivity.getDescription());
        // if companyId and userId exists
        if (updateActivity.getCompanyId() != null) {
            currentActivity.setCompany(companyRepository.findById(updateActivity.getCompanyId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Company not found with id: " + updateActivity.getCompanyId())));
        }
        if (updateActivity.getUserEmail() != null) {
            User user = userRepository.findByEmail(updateActivity.getUserEmail());
            if (user == null) {
                throw new EntityNotFoundException("User not found with email: " + updateActivity.getUserEmail());
            }
            currentActivity.setUser(user);
        }

        return new ActivityResponse(activityRepository.save(currentActivity));
    }
}
