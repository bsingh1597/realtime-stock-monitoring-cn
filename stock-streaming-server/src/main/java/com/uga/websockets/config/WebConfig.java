package com.uga.websockets.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class WebConfig implements WebMvcConfigurer{
	
	@Value("${frontend.base.url}")
	private String frontendBaseUrl;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins(frontendBaseUrl);
	}

}
