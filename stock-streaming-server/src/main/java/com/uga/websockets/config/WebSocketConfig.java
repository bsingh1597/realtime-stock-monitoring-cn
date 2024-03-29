package com.uga.websockets.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	/**
	 * Configuring the message broker
	 */
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {

		registry.setApplicationDestinationPrefixes("/app");

		// Message broker to carry the messages from client on destination prefixed with
		// /chatroom
		registry.enableSimpleBroker("/chatroom", "/trigger");
		
		registry.setUserDestinationPrefix("/client");
	}

	/**
	 * To register the STOMP endpoints for connecting to client
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		registry.addEndpoint("/webSocket").setAllowedOriginPatterns("*").withSockJS();
	}

}
