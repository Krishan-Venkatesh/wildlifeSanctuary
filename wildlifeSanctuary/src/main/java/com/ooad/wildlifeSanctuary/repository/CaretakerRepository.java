package com.ooad.wildlifeSanctuary.repository;

import com.ooad.wildlifeSanctuary.model.Caretaker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaretakerRepository extends MongoRepository<Caretaker, String> {
    Caretaker findByUserId(String userId);
    Optional<Caretaker> findByEmail(String email);
} 