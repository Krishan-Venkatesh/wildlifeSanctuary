package com.ooad.wildlifeSanctuary.repository;

import com.ooad.wildlifeSanctuary.model.Habitat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitatRepository extends MongoRepository<Habitat, String> {
} 