package com.activision.chatbot.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class WebSecurityConfig {

	@Autowired
	AuthEntryPoint authEntryPoint;
	
	@Bean
	UserDetailsService userDetailsService() {
		return new UserDetailsServiceImpl();
	}

	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}

	@Bean
	SecurityFilterChain configure(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/login", "/push_notification_demo.html","/ws/**","/app","/topic").permitAll()
				.anyRequest().authenticated())
				.formLogin(login -> login.disable())
				.logout(logout -> logout.disable())
				.csrf(csrf -> csrf.disable())
				.httpBasic(basic -> basic.authenticationEntryPoint(authEntryPoint));
				
		return http.build();
	}
	
    @Bean
    public WebMvcConfigurer corsMvcConfig() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@jakarta.annotation.Nonnull CorsRegistry registry) {
                String[] allowedOrigins;
                    allowedOrigins = new String[] { "http://localhost:5173"};
                registry
                    .addMapping("/**")
                    .allowedOrigins(allowedOrigins)
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
            }
        };
    }

}
