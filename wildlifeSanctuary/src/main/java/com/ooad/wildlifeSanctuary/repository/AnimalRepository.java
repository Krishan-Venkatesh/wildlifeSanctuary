package com.ooad.wildlifeSanctuary.repository;

import com.ooad.wildlifeSanctuary.model.Animal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends MongoRepository<Animal, String> {
    List<Animal> findByHabitatId(String habitatId);
    List<Animal> findByCaretakerId(String caretakerId);
} 