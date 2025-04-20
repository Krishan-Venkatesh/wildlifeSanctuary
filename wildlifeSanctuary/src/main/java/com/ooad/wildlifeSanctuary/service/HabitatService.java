package com.ooad.wildlifeSanctuary.service;

import com.ooad.wildlifeSanctuary.model.Habitat;
import com.ooad.wildlifeSanctuary.repository.HabitatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HabitatService {
    @Autowired
    private HabitatRepository habitatRepository;

    @Autowired
    private AnimalService animalService;

    public List<Habitat> getAllHabitats() {
        return habitatRepository.findAll();
    }

    public Optional<Habitat> getHabitatById(String id) {
        return habitatRepository.findById(id);
    }

    public Habitat createHabitat(Habitat habitat) {
        return habitatRepository.save(habitat);
    }

    public Habitat updateHabitat(String id, Habitat habitat) {
        habitat.setId(id);
        return habitatRepository.save(habitat);
    }

    public void deleteHabitat(String id) {
        habitatRepository.deleteById(id);
    }

    public List<Habitat> getHabitatsWithAnimals() {
        List<Habitat> habitats = habitatRepository.findAll();
        for (Habitat habitat : habitats) {
            habitat.setAnimalIds(animalService.getAnimalsByHabitat(habitat.getId())
                    .stream()
                    .map(animal -> animal.getId())
                    .toList());
        }
        return habitats;
    }
} 