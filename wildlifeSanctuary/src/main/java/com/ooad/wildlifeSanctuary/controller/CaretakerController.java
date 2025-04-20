package com.ooad.wildlifeSanctuary.controller;

import com.ooad.wildlifeSanctuary.model.Caretaker;
import com.ooad.wildlifeSanctuary.service.CaretakerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caretakers")
public class CaretakerController {

    @Autowired
    private CaretakerService caretakerService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_MANAGER', 'ROLE_CARETAKER')")
    public ResponseEntity<List<Caretaker>> getAllCaretakers() {
        List<Caretaker> caretakers = caretakerService.getAllCaretakers();
        return ResponseEntity.ok(caretakers);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Caretaker> createCaretaker(@RequestBody Caretaker caretaker) {
        Caretaker newCaretaker = caretakerService.createCaretaker(caretaker);
        return ResponseEntity.ok(newCaretaker);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_MANAGER', 'ROLE_CARETAKER')")
    public ResponseEntity<Caretaker> getCaretakerById(@PathVariable String id) {
        return caretakerService.getCaretakerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Caretaker> updateCaretaker(@PathVariable String id, @RequestBody Caretaker caretaker) {
        caretaker.setId(id);
        Caretaker updatedCaretaker = caretakerService.updateCaretaker(id, caretaker);
        return ResponseEntity.ok(updatedCaretaker);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteCaretaker(@PathVariable String id) {
        caretakerService.deleteCaretaker(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_MANAGER', 'ROLE_CARETAKER')")
    public ResponseEntity<Caretaker> getCaretakerByUserId(@PathVariable String userId) {
        Caretaker caretaker = caretakerService.getCaretakerByUserId(userId);
        if (caretaker != null) {
            return ResponseEntity.ok(caretaker);
        }
        return ResponseEntity.notFound().build();
    }
} 