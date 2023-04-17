package com.uga.websockets.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uga.websockets.entity.ConfirmationToken;
import com.uga.websockets.entity.UserStatus;
import com.uga.websockets.entity.User;
import com.uga.websockets.repo.UserRepo;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

	@Autowired
	BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private ConfirmationTokenService confirmationTokenService;

	@Autowired
	JavaMailSender mailSender;

	@Value("${mail.email.sender}")
	private String senderEmail;


	/**
	 *	service method to save registered user's information in database
	 */
	@Override
	@Transactional
	public User saveUser(User user) {

		// encoding the password
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user = userRepo.save(user);

		ConfirmationToken confirmationToken = new ConfirmationToken(user);
		confirmationTokenService.saveConfirmationToken(confirmationToken);
		sendConfirmationEmail(user.getEmail(), confirmationToken.getToken());
		return user;

	}

	/**
	 * service method to send activation email to the user provided email id during
	 * registration
	 */
	@Override
	public void sendConfirmationEmail(String email, String token) {

		// creating new mail message template
		SimpleMailMessage mailMessage = new SimpleMailMessage();

		// sending mail to the
		mailMessage.setTo(email);
		mailMessage.setSubject("Stock Watch Registration Confirmation email!!!");
		mailMessage.setFrom(senderEmail);
		mailMessage.setText(String.format(
				"Thank you for registering in Stock Watch. Please click on the below link to activate your account.http://localhost:8082/register/confirm?token=%s",
				token));
		mailSender.send(mailMessage);

	}

	/**
	 * Loads the user by user name
	 */
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepo.findByUsername(username).get();
	}

	/**
	 * finds the user from the database by the username provided during registration
	 */
	@Override
	public Optional<User> getUserByUsername(String username) {
		return userRepo.findByUsername(username);
	}

	/**
	 * activates the registered user with confirmation token link and deletes the
	 * confirmation token after it is used by the user
	 */
	@Override
	public void confirmUser(ConfirmationToken confirmationToken) {

		User user = confirmationToken.getUser();

		// set the user status to active
		user.setUserStatus(UserStatus.Active);
		userRepo.save(user);

		confirmationTokenService.deleteConfirmationToken(confirmationToken.getId());

	}

}
