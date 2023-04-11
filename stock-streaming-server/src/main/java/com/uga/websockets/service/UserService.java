package com.uga.websockets.service;

import java.util.Optional;

import com.uga.websockets.entity.ConfirmationToken;
import com.uga.websockets.entity.User;

public interface UserService {
	
	public User saveUser(User user);

	public Optional<User> getUserByUsername(String username);
	public void confirmUser(ConfirmationToken confirmationToken);
	public void sendConfirmationEmail(String email, String token);

}
