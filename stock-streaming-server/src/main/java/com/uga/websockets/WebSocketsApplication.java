package com.uga.websockets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.uga.websockets.service.StockPriceTriggerService;

@SpringBootApplication
@EnableScheduling
public class WebSocketsApplication {

	public static void main(String[] args) {
		ApplicationContext app = SpringApplication.run(WebSocketsApplication.class, args);
		StockPriceTriggerService stockPriceTrigger = app.getBean(StockPriceTriggerService.class);
		stockPriceTrigger.connectToFinHub();
	}

}
