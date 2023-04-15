package com.uga.websockets;

import java.util.concurrent.ExecutionException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebSocketsApplication {

	public static void main(String[] args) throws InterruptedException, ExecutionException {
		SpringApplication.run(WebSocketsApplication.class, args);
		
	}

}
