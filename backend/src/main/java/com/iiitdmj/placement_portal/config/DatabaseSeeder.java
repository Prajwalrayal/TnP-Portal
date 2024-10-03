package com.iiitdmj.placement_portal.config;

import com.iiitdmj.placement_portal.constants.UserRole;
import com.iiitdmj.placement_portal.constants.Position;
import com.iiitdmj.placement_portal.constants.Status;
import com.iiitdmj.placement_portal.entity.*;
import com.iiitdmj.placement_portal.entity.User.AdminRole;
import com.iiitdmj.placement_portal.entity.User.StudentRole;
import com.iiitdmj.placement_portal.entity.User.TprRole;
import com.iiitdmj.placement_portal.entity.User.User;
import com.iiitdmj.placement_portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(CompanyRepository companyRepository,
                                   ClientRepository clientRepository,
                                   StudentRoleRepository studentRoleRepository,
                                   TprRoleRepository tprRoleRepository,
                                   AdminRoleRepository adminRoleRepository,
                                   ActivityRepository activityRepository,
                                   ActivityLogRepository activityLogRepository) {

        return args -> {
            seedUsers(studentRoleRepository, tprRoleRepository, adminRoleRepository);
            seedCompaniesClientsAndActivities(companyRepository, clientRepository, activityRepository, activityLogRepository, tprRoleRepository);
        };
    }

    private void seedUsers(StudentRoleRepository studentRoleRepository,
                           TprRoleRepository tprRoleRepository,
                           AdminRoleRepository adminRoleRepository) {
        if (studentRoleRepository.count() == 0) {
            System.out.println("No students found. Seeding initial data...");
            seedUser("john.doe@example.com", "John", "Doe", UserRole.STUDENT, "https://www.linkedin.com/in/johndoe", "password123", studentRoleRepository);
        }

        if (adminRoleRepository.count() == 0) {
            System.out.println("No admins found. Seeding initial data...");
            seedUser("admin@example.com", "Admin", "User", UserRole.ADMIN, "https://www.linkedin.com/in/adminuser", "adminpass", adminRoleRepository);
        }

        if (tprRoleRepository.count() == 0) {
            System.out.println("No TPRs found. Seeding initial data...");
            seedUser("tpr@example.com", "Tpr", "User", UserRole.TPR, "https://www.linkedin.com/in/tpruser", "tprpass", tprRoleRepository);
        }
    }

    private<T extends User> void seedUser(String email, String firstName, String lastName, UserRole role, String linkedinUrl, String password, JpaRepository<T, String> repository) {
        T user;
        if (role == UserRole.STUDENT) {
            user = (T) new StudentRole();
        } else if (role == UserRole.ADMIN) {
            user = (T) new AdminRole();
        } else {
            user = (T) new TprRole();
        }

        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setLinkedinUrl(linkedinUrl);
        user.setPassword(password);
        repository.save(user);

        System.out.println(role + " Role seeded");
    }

    private void seedCompaniesClientsAndActivities(CompanyRepository companyRepository,
                                                   ClientRepository clientRepository,
                                                   ActivityRepository activityRepository,
                                                   ActivityLogRepository activityLogRepository,
                                                   TprRoleRepository tprRoleRepository) throws Exception {

        if (companyRepository.count() != 0) {
            return;
        }

        Company company1 = new Company();
        company1.setName("Google");
        company1.setEmail("contact@google.com");
        company1.setDescription("Leading tech giant");
        company1.setWebsite(new URL("https://www.google.com"));
        company1.setAddress("1600 Amphitheatre Parkway, Mountain View, CA");

        Company company2 = new Company();
        company2.setName("Flipkart");
        company2.setEmail("contact@flipkart.com");
        company2.setDescription("Leading e-commerce platform");
        company2.setWebsite(new URL("https://flipkart.com"));
        company2.setAddress("Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village, Bengaluru – 560103, Karnataka, India ");

        // Salaries and roles offered
        Salary salaryGoogle = new Salary();
        salaryGoogle.setBaseSalary(100000.0);
        salaryGoogle.setCtc(120000.0);
        salaryGoogle.setDescription("Software Engineer");
        company1.setRolesOffered(List.of("Software Engineer", "Winter Intern"));
        company1.setSalaries(List.of(salaryGoogle));

        Salary salaryFlipkart = new Salary();
        salaryFlipkart.setBaseSalary(120000.0);
        salaryFlipkart.setCtc(160000.0);
        salaryFlipkart.setDescription("Software Engineer");
        company2.setRolesOffered(List.of("Software Engineer", "Data Scientist"));
        company2.setSalaries(List.of(salaryFlipkart));

        companyRepository.saveAll(List.of(company1, company2));
        System.out.println(companyRepository.count() + " Companies seeded");

        seedClients(company1, company2, clientRepository);
        seedActivities(company1, activityRepository, activityLogRepository, tprRoleRepository);
    }

    private void seedClients(Company company1, Company company2, ClientRepository clientRepository) {
        Client client1 = createClient("client1@google.com", "Client", "One", company1, Position.HR_MANAGER, List.of("1234567890", "0987654321"));
        Client client2 = createClient("client2@google.com", "Client", "Two", company1, Position.CAMPUS_RECRUITER, List.of("123456789", "098765421"));
        Client client3 = createClient("client3@flipkart.com", "Client", "Three", company2, Position.DIRECTOR_OF_TALENT_ACQUISITION, List.of("123456789", "0987654321"));

        clientRepository.saveAll(List.of(client1, client2, client3));
        System.out.println(clientRepository.count() + " Clients seeded");
    }


    private Client createClient(String email, String firstName, String lastName, Company company, Position position, List<String> mobileNumbers) {
        Client client = new Client();
        client.setEmail(email);
        client.setFirstName(firstName);
        client.setLastName(lastName);
        client.setCompany(company);
        client.setPosition(position);
        client.setMobileNumbers(mobileNumbers);
        return client;
    }

    private void seedActivities(Company company, ActivityRepository activityRepository,
                                ActivityLogRepository activityLogRepository, TprRoleRepository tprRoleRepository) {

        TprRole tpr = tprRoleRepository.findAll(PageRequest.of(0, 1)).stream().findFirst().orElseThrow(
                () -> new IllegalStateException("No TPRs found to assign activities"));

        Activity activity1 = createActivity("Initial meeting", company, tpr, activityRepository);

        ActivityLog log1 = createActivityLog("First entry", activity1);
        ActivityLog log2 = createActivityLog("Second entry", activity1);

        activityLogRepository.saveAll(List.of(log1, log2));
        System.out.println(activityRepository.count() + " Activities seeded");
    }


    private Activity createActivity(String description, Company company, TprRole user, ActivityRepository activityRepository) {
        Activity activity = new Activity();
        activity.setDescription(description);
        activity.setCompany(company);
        activity.setUser(user);
        activity.setStatus(Status.INITIATED);
        activity.setCreatedAt(LocalDateTime.now());
        activity.setLastUpdated(LocalDateTime.now());
        activityRepository.save(activity);
        return activity;
    }

    private ActivityLog createActivityLog(String logMessage, Activity activity) {
        ActivityLog log = new ActivityLog();
        log.setLog(logMessage);
        log.setActivity(activity);
        log.setTimestamp(LocalDateTime.now());
        return log;
    }
}
