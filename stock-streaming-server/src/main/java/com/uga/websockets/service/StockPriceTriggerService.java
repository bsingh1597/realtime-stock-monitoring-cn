package com.uga.websockets.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.ClientEndpoint;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.uga.websockets.entity.Message;
import com.uga.websockets.entity.Message.MessageBuilder;
import com.uga.websockets.entity.TriggerData;


@ClientEndpoint
@Component
public class StockPriceTriggerService {
	
	private Session session;
	Logger logger = LoggerFactory.getLogger(StockPriceTriggerService.class);
	
	@Autowired
	SimpMessagingTemplate simpMessagingTemplate;

	Map<String, TriggerData> subscribedTriggers = new HashMap<>();

	@OnOpen
	public void onOpen(Session session) {
		logger.info("Inside the onOpen method");
		this.session = session;
//		subscribeToStock("BINANCE:BTCUSDT", 30800.0); // Set trigger for AAPL stock at $150
	}

	@OnMessage
	public void onMessage(String message) throws ParseException {
		System.out.println("Received message: " + message);

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(message);

		JSONArray responseHavingData = (JSONArray) json.get("data");
		if (responseHavingData != null) {
			JSONObject quote = (JSONObject) responseHavingData.get(0);
			String stockTkr = (String) quote.get("s");
			Double currentPrice = (quote.get("p") instanceof Double) ? (Double) quote.get("p") : null;
			logger.info("Current Price: {} and {}", stockTkr, currentPrice);

//			Check for the stock price based on the trigger passed by client
			if(StringUtils.isNoneEmpty(stockTkr) && currentPrice != null) {
				TriggerData responseData = subscribedTriggers.get(stockTkr);
				if (responseData != null) {
					switch (responseData.getTriggerType()) {
					case StopLoss:
						if (currentPrice <= responseData.getPrice()) {
							logger.info("StopLoss triggered for stock {}", responseData.getSymbol());
							sendAlert(MessageBuilder.getInstance()
									.setMessage(String.format("Price dropped for Stock %s below %s",
											responseData.getSymbol(), responseData.getPrice()))
									.build());
						}
						break;
					case Target:
						if (currentPrice >= responseData.getPrice()) {
							logger.info("Target triggered for stock {}", responseData.getSymbol());
							sendAlert(MessageBuilder.getInstance()
									.setMessage(String.format("Price exceeded for Stock %s above %s",
											responseData.getSymbol(), responseData.getPrice()))
									.build());
						}
					default:
						break;
					}
				}
			}
		}

	}

	public void connectToFinHub() {
		URI uri;
		try {
			uri = new URI("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0");

			WebSocketContainer container = ContainerProvider.getWebSocketContainer();
			container.connectToServer(this, uri).setMaxIdleTimeout(0);
		} catch (URISyntaxException | DeploymentException | IOException e) {
			e.printStackTrace();
		}
	}

	public void subscribeToStock(TriggerData triggerData) {
		try {

			subscribedTriggers.put(triggerData.getSymbol(), triggerData);
			String subscriptionMessage = "{\"type\":\"subscribe\",\"symbol\":\"" + triggerData.getSymbol()+"\"}";
			session.setMaxIdleTimeout(0);
			session.getBasicRemote().sendText(subscriptionMessage);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private Message sendAlert(@Payload Message message) {
		logger.info("Inside SendAlert" + message);
		simpMessagingTemplate.convertAndSend("/chatroom/alert", message);
		return message;

	}
}
