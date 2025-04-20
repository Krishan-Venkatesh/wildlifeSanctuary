package com.ooad.wildlifeSanctuary.service;

import com.ooad.wildlifeSanctuary.model.User;
import com.ooad.wildlifeSanctuary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public User createUser(User user) {
        // Check if user with same email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateKeyException("A user with this email already exists");
        }
        
        // Check if user with same username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateKeyException("A user with this username already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
} 