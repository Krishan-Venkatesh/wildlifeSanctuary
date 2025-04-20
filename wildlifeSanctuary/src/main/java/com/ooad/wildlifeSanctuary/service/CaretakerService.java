package com.ooad.wildlifeSanctuary.service;

import com.ooad.wildlifeSanctuary.model.Caretaker;
import com.ooad.wildlifeSanctuary.repository.CaretakerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaretakerService {
    @Autowired
    private CaretakerRepository caretakerRepository;

    @Autowired
    private AnimalService animalService;

    public List<Caretaker> getAllCaretakers() {
        return caretakerRepository.findAll();
    }

    public Optional<Caretaker> getCaretakerById(String id) {
        return caretakerRepository.findById(id);
    }

    public Caretaker createCaretaker(Caretaker caretaker) {
        // Check if caretaker with same email already exists
        if (caretakerRepository.findByEmail(caretaker.getEmail()).isPresent()) {
            throw new DuplicateKeyException("A caretaker with this email already exists");
        }
        return caretakerRepository.save(caretaker);
    }

    public Caretaker updateCaretaker(String id, Caretaker caretaker) {
        // Check if the new email is already taken by another caretaker
        Optional<Caretaker> existingCaretaker = caretakerRepository.findByEmail(caretaker.getEmail());
        if (existingCaretaker.isPresent() && !existingCaretaker.get().getId().equals(id)) {
            throw new DuplicateKeyException("A caretaker with this email already exists");
        }
        caretaker.setId(id);
        return caretakerRepository.save(caretaker);
    }

    public void deleteCaretaker(String id) {
        caretakerRepository.deleteById(id);
    }

    public Caretaker getCaretakerByUserId(String userId) {
        return caretakerRepository.findByUserId(userId);
    }

    public List<Caretaker> getCaretakersWithAnimals() {
        List<Caretaker> caretakers = caretakerRepository.findAll();
        for (Caretaker caretaker : caretakers) {
            caretaker.setAssignedAnimalIds(animalService.getAnimalsByCaretaker(caretaker.getId())
                    .stream()
                    .map(animal -> animal.getId())
                    .toList());
        }
        return caretakers;
    }
} 