package com.ooad.wildlifeSanctuary.controller;

import com.ooad.wildlifeSanctuary.model.Habitat;
import com.ooad.wildlifeSanctuary.service.HabitatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitats")
public class HabitatController {
    @Autowired
    private HabitatService habitatService;

    @GetMapping
    public ResponseEntity<List<Habitat>> getAllHabitats() {
        return ResponseEntity.ok(habitatService.getAllHabitats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habitat> getHabitatById(@PathVariable String id) {
        return habitatService.getHabitatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Habitat> createHabitat(@RequestBody Habitat habitat) {
        return ResponseEntity.ok(habitatService.createHabitat(habitat));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Habitat> updateHabitat(@PathVariable String id, @RequestBody Habitat habitat) {
        return ResponseEntity.ok(habitatService.updateHabitat(id, habitat));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteHabitat(@PathVariable String id) {
        habitatService.deleteHabitat(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/with-animals")
    public ResponseEntity<List<Habitat>> getHabitatsWithAnimals() {
        return ResponseEntity.ok(habitatService.getHabitatsWithAnimals());
    }
} 