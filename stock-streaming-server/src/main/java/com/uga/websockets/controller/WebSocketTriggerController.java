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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.uga.websockets.entity.Message;
import com.uga.websockets.entity.Message.MessageBuilder;
import com.uga.websockets.entity.TriggerData;

@RestController
public class WebSocketTriggerController {

	Logger logger = LoggerFactory.getLogger(WebSocketTriggerController.class);
	
	Map<String, TriggerData> subscribedTriggers = new HashMap<>();
	
	private String finnhubApiKey = "cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0";
	
	@Autowired
	SimpMessagingTemplate simpMessagingTemplate;


	@PostMapping("/subscribe")
	public String subscribeToStock(@RequestBody TriggerData triggerData) {

		logger.info("Inside subscribeToStock: {}", triggerData);
		subscribedTriggers.put(triggerData.getSymbol(), triggerData);
		return "Subscribed to Stock";
	}
	
	@Scheduled(fixedDelay = 6000) // run the code every minute
	public void checkStockPrice() {
		logger.info("Inside checkStockPrice");
		RestTemplate restTemplate = new RestTemplate();
		for(Map.Entry<String,TriggerData> entry : subscribedTriggers.entrySet()) {
			String apiUrl = "https://finnhub.io/api/v1/quote?symbol=" + entry.getValue().getSymbol() + "&token=" + finnhubApiKey;
			Map<String, Object> quote = restTemplate.getForObject(apiUrl, HashMap.class);
			logger.info("Map for quote" + quote);
			
			double currentPrice = (double) quote.get("c");
			logger.info("Stock Price" + currentPrice);
			switch (entry.getValue().getTriggerType()) {
			case StopLoss:
				if (currentPrice <= entry.getValue().getPrice()) {
					logger.info("StopLoss triggered for stock {}", entry.getValue().getSymbol());
					sendAlert(MessageBuilder.getInstance()
							.setMessage(String.format("Price dropped for Stock %s below %s",
									entry.getValue().getSymbol(), entry.getValue().getPrice()))
							.build());
				}
				break;
			case Target:
				if (currentPrice >= entry.getValue().getPrice()) {
					logger.info("Target triggered for stock {}", entry.getValue().getSymbol());
					sendAlert(MessageBuilder.getInstance()
							.setMessage(String.format("Price exceeded for Stock %s above %s",
									entry.getValue().getSymbol(), entry.getValue().getPrice()))
							.build());
				}
			default:
				break;
			}
		}
		
	}
	

	@MessageMapping("/alert")
	@SendTo("/chatroom/alert")
	public Message sendAlert(@Payload Message message) {
		logger.info("Inside SendAlert" + message);
		simpMessagingTemplate.convertAndSend("/trigger/alert", message);
		return message;
	}

}
