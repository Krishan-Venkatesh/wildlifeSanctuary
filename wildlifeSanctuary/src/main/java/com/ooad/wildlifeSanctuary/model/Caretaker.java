package com.ooad.wildlifeSanctuary.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "caretakers")
public class Caretaker {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String phoneNumber;
    private List<String> assignedAnimalIds;
    private String specialization;
    private String userId; // Reference to User collection for authentication

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<String> getAssignedAnimalIds() {
        return assignedAnimalIds;
    }

    public void setAssignedAnimalIds(List<String> assignedAnimalIds) {
        this.assignedAnimalIds = assignedAnimalIds;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
} 