package com.uga.websockets.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.uga.websockets.entity.Message;

@Controller
public class ChatController {

	Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate; 

	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	public Message receivePublicMessgae(@Payload Message message) {
		logger.info("Inside receivePublicMessgae message: {}", message);
		return message;
	}

	// @MessageMapping("/privateMessage")
	// public Message receivePrivateMessage(@Payload Message message) {
	// 	logger.info("Inside receivePrivateMessage message: {}", message);
	// 	simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
	// 	return message;
	// }

}
