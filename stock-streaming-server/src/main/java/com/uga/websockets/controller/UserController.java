package com.uga.websockets.controller;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uga.websockets.entity.ConfirmationToken;
import com.uga.websockets.entity.User;
import com.uga.websockets.entity.UserStatus;
import com.uga.websockets.helper.JwtTokenHelper;
import com.uga.websockets.response.ServiceResponse;
import com.uga.websockets.service.ConfirmationTokenService;
import com.uga.websockets.service.UserService;

@RestController
public class UserController {

	Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	UserService userService;

	@Autowired
	ConfirmationTokenService confirmationTokenService;

	@Autowired
	AuthenticationManager authManager;

	@Autowired
	JwtTokenHelper jwtTokenHelper;

	/**
	 * @return
	 */
	@GetMapping("/signup")
	public String showSingupForm() {
		return "signup";
	}

	/**
	 * controller method for user registration/signup
	 * @param user
	 * @return
	 */
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {

		logger.info("Inside registerUser" + user);

		if (userService.getUserByUsername(user.getUsername()).isPresent()) {
			return new ResponseEntity<>("User is already present", HttpStatus.ALREADY_REPORTED);
		}

		user = userService.saveUser(user);
		user.setPassword(null);

		return new ResponseEntity<>("User created", HttpStatus.CREATED);

	}

	/**
	 * controller method for user login
	 * @param auth
	 * @return
	 * @throws InvalidKeySpecException
	 * @throws NoSuchAlgorithmException
	 */
	@GetMapping("/login")
	public ResponseEntity<?> authenticateLogin(@RequestHeader(HttpHeaders.AUTHORIZATION) String auth)
			throws InvalidKeySpecException, NoSuchAlgorithmException {

		logger.info("Inside authenticateLogin: {}", auth);

		String authReq = new String(Base64.getDecoder().decode(auth.substring(6)));
		String username = authReq.split(":")[0];
		String password = authReq.split(":")[1];

		logger.info("{} : {}", username, password);

		final Authentication authentication = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(username, password));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		User user = (User) authentication.getPrincipal();

		if (user.getUserStatus().equals(UserStatus.Inactive)) {
			return new ResponseEntity<>(
					new ServiceResponse.ServiceResponseBuilder().setMessage("Please validate email").build(),
					HttpStatus.OK);
		}

		String token = jwtTokenHelper.generateToken(user.getUsername());

		return new ResponseEntity<>(new ServiceResponse.ServiceResponseBuilder().setToken(token).build(),
				HttpStatus.OK);
	}
	
	/**
	 * controller method to activate the registered/signed up user before logging in
	 * @param token
	 * @param httpServletResponse
	 */
	@GetMapping("/register/confirm")
	public void confirmMail(@RequestParam String token, HttpServletResponse httpServletResponse) {

		logger.info("Inside confirmMail" + token);

		Optional<ConfirmationToken> confirmationToken = confirmationTokenService.findConfirmationTokenByToken(token);

		confirmationToken.ifPresent((a) -> userService.confirmUser(a));

		httpServletResponse.setHeader("Location", "http://localhost:3000/login");
		httpServletResponse.setStatus(302);

	}

}
