package com.uga.websockets.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import com.uga.websockets.entity.Message;

@Controller

public class WebSocketTriggerController {

	Logger logger = LoggerFactory.getLogger(WebSocketTriggerController.class);

	@Autowired
	SimpMessagingTemplate simpMessagingTemplate;

	private double alertThreshold = 30376.0; // set the alert threshold here
	private String stockSymbol = "BINANCE:BTCUSDT"; // set the stock symbol here
	private String finnhubApiKey = "cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"; // set your Finnhub API key here
	private String alertMessage = "Stock price of " + stockSymbol + " has crossed the alert threshold of "
			+ alertThreshold;

	@Scheduled(fixedDelay = 6000) // run the code every minute
	public void checkStockPrice() {

		logger.info("Inside checkStockPrice");
		RestTemplate restTemplate = new RestTemplate();
		String apiUrl = "https://finnhub.io/api/v1/quote?symbol=" + stockSymbol + "&token=" + finnhubApiKey;
		
		Map<String, Object> quote = restTemplate.getForObject(apiUrl, HashMap.class);
		logger.info("Map for quote" + quote);
		double stockPrice = (double) quote.get("c");
		logger.info("Stock Price" + stockPrice);
		
		if (stockPrice < alertThreshold) {
			Message alertMessage = new Message();
			alertMessage.setMessage(this.alertMessage);
			sendAlert(alertMessage);
		}
	}

	@MessageMapping("/alert")
	@SendTo("/chatroom/alert")
	public Message sendAlert(@Payload Message message) {
		logger.info("Inside SendAlert" + message);
		simpMessagingTemplate.convertAndSend("/chatroom/alert", message);
		return message;

	}

}
