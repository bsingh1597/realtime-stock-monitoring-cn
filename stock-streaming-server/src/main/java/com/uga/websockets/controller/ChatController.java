package com.uga.websockets.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.uga.websockets.entity.Message;
import com.uga.websockets.entity.Status;

@Controller
public class ChatController {

	Logger logger = LoggerFactory.getLogger(ChatController.class);
	

	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	public Message receivePublicMessgae(@Payload Message message) {
		logger.info("Inside receivePublicMessgae message: {}", message);
		return message;
	}

	@MessageMapping("/logout")
	@SendTo("/chatroom/public")
	public Message userLogout(@Payload Message message) {
		logger.info("Inside receivePublicMessgae message: {}", message);
		message.setMessage("Left the Chat room");
		message.setStatus(Status.LEFT);
		return message;
	}
}
