package com.uga.websockets.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uga.websockets.entity.TriggerData;
import com.uga.websockets.service.StockPriceTriggerService;

@RestController
public class WebSocketTriggerController {

	Logger logger = LoggerFactory.getLogger(WebSocketTriggerController.class);

	@Autowired
	StockPriceTriggerService stockPriceTriggerService;

	@PostMapping("/subscribe")
	public String subscribeToStock(@RequestBody TriggerData triggerData) {

		logger.info("Inside subscribeToStock: {}", triggerData);

		stockPriceTriggerService.subscribeToStock(triggerData);
		return "Subscribed to Stock";
	}

}
