package com.uga.websockets.entity;

import org.springframework.security.core.GrantedAuthority;

public class Authority implements GrantedAuthority{
	
	private static final long serialVersionUID = 6267167065870794987L;
	
	private String authority;
	
	public void setAuthority() {
		this.authority = "user";
	}

	@Override
	public String getAuthority() {
		return authority;
	}

}
