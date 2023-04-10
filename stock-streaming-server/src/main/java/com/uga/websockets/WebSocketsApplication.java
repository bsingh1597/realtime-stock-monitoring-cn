package com.uga.websockets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.uga.websockets.config.WebSocketsTrigger;

@SpringBootApplication
public class WebSocketsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebSocketsApplication.class, args);
		WebSocketsTrigger trigger = new WebSocketsTrigger();
		trigger.checkStockPrice();

	}

}
