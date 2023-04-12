package com.uga.websockets.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uga.websockets.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);


	

}
