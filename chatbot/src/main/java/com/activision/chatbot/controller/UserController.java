package com.activision.chatbot.controller;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.activision.chatbot.auth.UserDetailsImpl;
import com.activision.chatbot.entity.User;

@RequestMapping("/api/users")
@RestController
public class UserController {

	@GetMapping("/@me/roles")
	public List<String> getRoles(@AuthenticationPrincipal UserDetailsImpl principal){
		return principal.getAuthorities().stream().map(auth -> auth.getAuthority()).toList();
	}
	
	@GetMapping("/@me")
	public User getUser(@AuthenticationPrincipal UserDetailsImpl principal){
		return principal.getUser();
	}
}
