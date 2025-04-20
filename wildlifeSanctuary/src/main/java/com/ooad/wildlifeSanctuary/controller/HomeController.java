package com.ooad.wildlifeSanctuary.controller;

import com.ooad.wildlifeSanctuary.service.AnimalService;
import com.ooad.wildlifeSanctuary.service.HabitatService;
import com.ooad.wildlifeSanctuary.service.CaretakerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    @Autowired
    private AnimalService animalService;

    @Autowired
    private HabitatService habitatService;

    @Autowired
    private CaretakerService caretakerService;

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalAnimals", animalService.getAllAnimals().size());
        statistics.put("totalHabitats", habitatService.getAllHabitats().size());
        statistics.put("totalCaretakers", caretakerService.getAllCaretakers().size());
        
        return ResponseEntity.ok(statistics);
    }
} 