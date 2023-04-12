package com.uga.websockets.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uga.websockets.entity.ConfirmationToken;

public interface ConfirmationTokenRepo extends JpaRepository<ConfirmationToken, Long>{
	
	Optional<ConfirmationToken> findByToken(String token);

}
