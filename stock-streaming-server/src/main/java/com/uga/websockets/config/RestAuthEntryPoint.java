package com.uga.websockets.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class RestAuthEntryPoint implements AuthenticationEntryPoint {

	Logger logger = LoggerFactory.getLogger(RestAuthEntryPoint.class);
	
	
	/**
	 * servlet entry point 
	 */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		
		logger.error("The request is Unauthorized path: {}", request.getPathInfo());
		
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED,authException.getMessage());
		
	}

}
