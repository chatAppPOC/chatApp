package com.activision.chatbot.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.activision.chatbot.entity.Player;
import com.activision.chatbot.entity.User;
import com.activision.chatbot.repo.PlayerRepository;
import com.activision.chatbot.repo.UserRepository;

public class UserDetailsServiceImpl implements UserDetailsService{

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
	private PlayerRepository playerRepo;

	@Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = userRepository.getUserByEmail(username);
        Player player = playerRepo.getPlayerByEmail(username);
         
        if (user != null) {
        	return new UserDetailsImpl(user, null);
        } else if(player != null) {
        	return new UserDetailsImpl(null, player);
        } else {
        	throw new UsernameNotFoundException("Could not find user or player");
        }
         
        
    }
	
}
