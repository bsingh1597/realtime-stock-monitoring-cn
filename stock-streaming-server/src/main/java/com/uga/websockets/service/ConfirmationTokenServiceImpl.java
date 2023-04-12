package com.uga.websockets.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uga.websockets.entity.ConfirmationToken;
import com.uga.websockets.repo.ConfirmationTokenRepo;

@Service
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {
	
	@Autowired
	ConfirmationTokenRepo confirmationTokenRepo;
	
	
	@Override
	public void saveConfirmationToken(ConfirmationToken confirmationToken) {
		
		confirmationTokenRepo.save(confirmationToken);
		
	}
	
	@Override
	public void deleteConfirmationToken(Long id) {
		
		confirmationTokenRepo.deleteById(id);
		
	}

	@Override
	public Optional<ConfirmationToken> findConfirmationTokenByToken(String token){
		return confirmationTokenRepo.findByToken(token);
		
	}

}
