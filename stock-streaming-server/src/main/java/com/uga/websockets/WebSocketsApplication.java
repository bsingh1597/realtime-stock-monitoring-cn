package com.uga.websockets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.uga.websockets.controller.StockPriceTrigger;

@SpringBootApplication
@EnableScheduling
public class WebSocketsApplication {

	public static void main(String[] args) {
		//SpringApplication.run(WebSocketsApplication.class, args);
		ApplicationContext app = SpringApplication.run(WebSocketsApplication.class, args);
		StockPriceTrigger myBean = app.getBean(StockPriceTrigger.class);
		myBean.subscribeToStock(null, 0);
	}

}
