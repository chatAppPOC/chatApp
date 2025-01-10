package com.activision.chatbot.auth;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.activision.chatbot.entity.Player;
import com.activision.chatbot.entity.Role;
import com.activision.chatbot.entity.User;

public class UserDetailsImpl implements UserDetails, Principal {

	private User user;
	private Player player;
    
    public UserDetailsImpl(User user, Player player) {
    	this.player = player;
        this.user = user;
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
		if (user != null) {
			Set<Role> roles = user.getRoles();
	        
	         
	        for (Role role : roles) {
	            authorities.add(new SimpleGrantedAuthority(role.getName()));
	        }
		} else if(player != null) {
			authorities.add(new SimpleGrantedAuthority("PLAYER"));
		}
        return authorities;
	}

	@Override
	public String getPassword() {
		if(user != null) {
			return user.getPassword();
		}
		return player.getPassword();	
	}

	@Override
	public String getUsername() {
		if(user != null) {
			return user.getEmail();
		}
		return player.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		if(user != null) {
			return user.isEnabled();
		}
		return player.isEnabled();
	}
	
	public User getUser() {
		return user;
	}
	
	public Player getPlayer() {
		return player;
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}
}
