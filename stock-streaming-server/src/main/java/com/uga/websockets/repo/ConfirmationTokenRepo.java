package com.uga.websockets.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uga.websockets.entity.ConfirmationToken;

public interface ConfirmationTokenRepo extends JpaRepository<ConfirmationToken, Long>{
	
	// gets the confirmation token from database by filed token which is an unique entry
	Optional<ConfirmationToken> findByToken(String token);

}
