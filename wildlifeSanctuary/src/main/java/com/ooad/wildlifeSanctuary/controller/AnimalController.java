package com.ooad.wildlifeSanctuary.controller;

import com.ooad.wildlifeSanctuary.model.Animal;
import com.ooad.wildlifeSanctuary.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {
    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<Animal>> getAllAnimals() {
        return ResponseEntity.ok(animalService.getAllAnimals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable String id) {
        return animalService.getAnimalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Animal> createAnimal(@RequestBody Animal animal) {
        return ResponseEntity.ok(animalService.createAnimal(animal));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Animal> updateAnimal(@PathVariable String id, @RequestBody Animal animal) {
        return ResponseEntity.ok(animalService.updateAnimal(id, animal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteAnimal(@PathVariable String id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/habitat/{habitatId}")
    public ResponseEntity<List<Animal>> getAnimalsByHabitat(@PathVariable String habitatId) {
        return ResponseEntity.ok(animalService.getAnimalsByHabitat(habitatId));
    }

    @GetMapping("/caretaker/{caretakerId}")
    public ResponseEntity<List<Animal>> getAnimalsByCaretaker(@PathVariable String caretakerId) {
        return ResponseEntity.ok(animalService.getAnimalsByCaretaker(caretakerId));
    }
} 