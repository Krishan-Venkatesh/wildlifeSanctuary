package com.ooad.wildlifeSanctuary.controller;

import com.ooad.wildlifeSanctuary.model.User;
import com.ooad.wildlifeSanctuary.security.JwtUtils;
import com.ooad.wildlifeSanctuary.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.get("username"),
                        loginRequest.get("password")
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        User newUser = userService.createUser(user);
        Map<String, Object> response = new HashMap<>();
        response.put("id", newUser.getId());
        response.put("username", newUser.getUsername());
        response.put("role", newUser.getRole());

        return ResponseEntity.ok(response);
    }
} 