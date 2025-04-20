package com.ooad.wildlifeSanctuary.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "habitats")
public class Habitat {
    @Id
    private String id;
    private String name;
    private String type;
    private String description;
    private double area;
    private String climate;
    private List<String> animalIds;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }

    public List<String> getAnimalIds() {
        return animalIds;
    }

    public void setAnimalIds(List<String> animalIds) {
        this.animalIds = animalIds;
    }
} 