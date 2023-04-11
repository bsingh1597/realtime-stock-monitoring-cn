package com.uga.websockets.service;

import java.util.Optional;

import com.uga.websockets.entity.ConfirmationToken;

public interface ConfirmationTokenService {
	
	public void saveConfirmationToken(ConfirmationToken confirmationToken);
	public void deleteConfirmationToken(Long id);
	public Optional<ConfirmationToken> findConfirmationTokenByToken(String token);

}
