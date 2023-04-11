package com.uga.websockets.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "confirmation_token")
public class ConfirmationToken {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "token")
	private String token;
	
	@Column(name = "created_on", insertable = false, updatable = false)
	private LocalDateTime createdOn;
	
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	public ConfirmationToken(User user) {
		this.user = user;
		this.token = UUID.randomUUID().toString();
	}
	
	public ConfirmationToken() {
		super();
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public LocalDateTime getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(LocalDateTime createdOn) {
		this.createdOn = createdOn;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "ConfirmationToken [id=" + id + ", token=" + token + ", createdOn=" + createdOn + ", user=" + user.getId() + "]";
	}


}
