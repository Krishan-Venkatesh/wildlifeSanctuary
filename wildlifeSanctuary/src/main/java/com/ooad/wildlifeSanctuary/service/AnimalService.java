package com.ooad.wildlifeSanctuary.service;

import com.ooad.wildlifeSanctuary.model.Animal;
import com.ooad.wildlifeSanctuary.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {
    @Autowired
    private AnimalRepository animalRepository;

    public List<Animal> getAllAnimals() {
        return animalRepository.findAll();
    }

    public Optional<Animal> getAnimalById(String id) {
        return animalRepository.findById(id);
    }

    public Animal createAnimal(Animal animal) {
        return animalRepository.save(animal);
    }

    public Animal updateAnimal(String id, Animal animal) {
        animal.setId(id);
        return animalRepository.save(animal);
    }

    public void deleteAnimal(String id) {
        animalRepository.deleteById(id);
    }

    public List<Animal> getAnimalsByHabitat(String habitatId) {
        return animalRepository.findByHabitatId(habitatId);
    }

    public List<Animal> getAnimalsByCaretaker(String caretakerId) {
        return animalRepository.findByCaretakerId(caretakerId);
    }
} 