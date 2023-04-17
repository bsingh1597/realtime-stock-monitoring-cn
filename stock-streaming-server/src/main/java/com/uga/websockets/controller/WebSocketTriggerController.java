package com.uga.websockets.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.uga.websockets.entity.TriggerData;
import com.uga.websockets.helper.WebSocketStocksConstant;

@RestController
public class WebSocketTriggerController {

	Logger logger = LoggerFactory.getLogger(WebSocketTriggerController.class);
	
	// set to store subscribed triggers
	Set<TriggerData> subscribedTriggers = new HashSet<>();

	@Autowired
	SimpMessagingTemplate simpMessagingTemplate;

	//controller method to store subscribed stocks
	@PostMapping("/subscribe/trigger")
	public String subscribeToStock(@RequestBody TriggerData triggerData) {

		logger.info("Inside subscribeToStock: {}", triggerData);
		subscribedTriggers.add(triggerData);
		return String.format("Subscribed to the stock %s for %s at Price %s", triggerData.getSymbol(),
				triggerData.getTriggerType(), triggerData.getPrice());
	}

	@Scheduled(fixedDelay = 6000) // run the code every minute
	public void checkStockPrice() {
		logger.info("Inside checkStockPrice");
		RestTemplate restTemplate = new RestTemplate();
		
		// Iterate over the set and call the FinhubApi to check for the price
		for (TriggerData triggerData : subscribedTriggers) {
			String apiUrl = String.format("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", triggerData.getSymbol(),
					WebSocketStocksConstant.FINHUB_TOKEN);
			Map<String, Object> quote = restTemplate.getForObject(apiUrl, HashMap.class);
			logger.info("Map for quote" + quote);

			double currentPrice = (double) quote.get("c");
			logger.info("Stock Price" + currentPrice);
			switch (triggerData.getTriggerType()) {
			case StopLoss: // StopLoss is the to be triggered when price of the stock goes down the trigger price
				if (currentPrice <= Double.valueOf(triggerData.getPrice())) {
					logger.info("StopLoss triggered for stock {}", triggerData.getSymbol());
					sendAlert(triggerData);
				}
				break;
			case Target:  // Target is to be triggered when the price of the stock goes up the trigger proce
				if (currentPrice >= Double.valueOf(triggerData.getPrice())) {
					logger.info("Target triggered for stock {}", triggerData.getSymbol());
					sendAlert(triggerData);
				}
			default:
				break;
			}
			
			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

	}

	// This uses simMessagingTeplate to push trigger data to topic which is subscribed by the clients
	public TriggerData sendAlert(@Payload TriggerData triggerData) {
		logger.info("Inside SendAlert" + triggerData);
		simpMessagingTemplate.convertAndSend("/trigger/alert", triggerData);
		return triggerData;
	}
	
	//controller method to remove unsubscribed stocks
	@PostMapping("/unsubscribe/trigger")
	public String unsubscribeToStock(@RequestBody TriggerData triggerData) {
		
		logger.info("Inside unSubscribeToStock: {}", triggerData);
		subscribedTriggers.remove(triggerData);
		
		return String.format("Unsubscribed from the stock %s for %s at Price %s", triggerData.getSymbol(),
				triggerData.getTriggerType(), triggerData.getPrice());
	}

}
