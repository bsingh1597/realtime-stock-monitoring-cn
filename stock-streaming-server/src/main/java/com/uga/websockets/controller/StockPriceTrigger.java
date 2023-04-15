package com.uga.websockets.controller;

import java.net.URI;
import java.net.URISyntaxException;

import javax.websocket.ClientEndpoint;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@ClientEndpoint
public class StockPriceTrigger {

	private Session session;
	Logger logger = org.slf4j.LoggerFactory.getLogger(StockPriceTrigger.class);
	
	@OnOpen
	public void onOpen(Session session) {
		logger.info("Inside the onOpen method");
		this.session = session;
		subscribeToStock("BINANCE:BTCUSDT", 30800.0); // Set trigger for AAPL stock at $150
	}

	@OnMessage
	public void onMessage(String message) throws ParseException {
		System.out.println("Received message: " + message);
		
		JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(message);
        
		 org.json.simple.JSONArray data = (org.json.simple.JSONArray) json.get("data");
         JSONObject quote = (JSONObject) data.get(0);
         Double currentPrice = (Double) quote.get("p");
         System.out.println("Current Price: " + currentPrice);
		// Check if stock price is above trigger and take action if it is
	}
	
	@EventListener(ApplicationReadyEvent.class)
	public void subscribeToStock(String symbol, double price) {
		try {
			URI uri = new URI("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0");
			WebSocketContainer container = ContainerProvider.getWebSocketContainer();
			container.connectToServer(this, uri);

			String subscriptionMessage = "{\"type\":\"subscribe\",\"symbol\":\"" + symbol + "\",\"price\":" + price
					+ "}";
			session.getBasicRemote().sendText(subscriptionMessage);
		} catch (URISyntaxException | DeploymentException | java.io.IOException e) {
			e.printStackTrace();
		}
	}
}

