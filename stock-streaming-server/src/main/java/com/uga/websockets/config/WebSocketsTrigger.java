package com.uga.websockets.config;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
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

//@Controller
//public class WebSocketsTrigger {
//
//	private Session userSession = null;
//	@Autowired
//	SimpMessagingTemplate simpMessagingTemplate;
//
//	private Session session;
//
//	public void WebSocketsTrigger() throws IOException, URISyntaxException, DeploymentException {
//		// WebSocketClient(URI("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"));
//
//		URI uri = new URI("wss://ws.finnhub.io?token=<your_api_key>");
//		WebSocketContainer container = ContainerProvider.getWebSocketContainer();
//		container.connectToServer(this, uri);
//		this.session.getBasicRemote().sendText("{\"type\":\"subscribe\",\"symbol\":\"" + "AAPL" + "\"}");
//			String stockSymbol = "BINANCE:BTCUSDT"; // set the stock symbol here
//			String ApiKey = "cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0";
//			WebSocketClient client = new StandardWebSocketClient();
//			WebSocketStompClient stompClient = new WebSocketStompClient(client);
//			StompSessionHandler handler = new StompSessionHandler() {

//				public void handleFrame(StompHeaders headers, @Nullable Object payload) {
//					// TODO Auto-generated method stub
//
//				}
//
//				public Type getPayloadType(StompHeaders headers) {
//					// TODO Auto-generated method stub
//					return null;
//				}
//
//				public void handleTransportError(StompSession session, Throwable exception) {
//					// TODO Auto-generated method stub
//
//				}
//
//				public void handleException(StompSession session, @Nullable StompCommand command, StompHeaders headers,
//						byte[] payload, Throwable exception) {
//			CompletableFuture<StompSession> sessionAsync = stompClient
//					.connectAsync("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0", handler, "");
//			StompSession session = sessionAsync.get();
//			session.subscribe("", handler);

//			while (true) {
//				session.send("", "");
//				Thread.sleep(10000);
//			}
	//}

//	/**
//	 * Callback hook for Connection open events.
//	 *
//	 * @param userSession the userSession which is opened.
//	 */
//	@OnOpen
//	public void onOpen(Session userSession) {
//		System.out.println("opening websocket");
//		this.userSession = userSession;
//	}
//
//	/**
//	 * Callback hook for Connection close events.
//	 *
//	 * @param userSession the userSession which is getting closed.
//	 * @param reason      the reason for connection close
//	 */
//	@OnClose
//	public void onClose(Session userSession, CloseReason reason) {
//		System.out.println("closing websocket");
//		this.userSession = null;
//	}
//
//	/**
//	 * Callback hook for Message Events. This method will be invoked when a client
//	 * send a message.
//	 *
//	 * @param message The text message
//	 */
//	@OnMessage
//	public void onMessage(String message) throws ParseException, org.json.simple.parser.ParseException {
//		org.json.simple.parser.JSONParser parser = new org.json.simple.parser.JSONParser();
//		JSONObject json = (JSONObject) parser.parse(message);
//
//		if (json.containsKey("data")) {
//			JSONArray data = (JSONArray) json.get("data");
//			JSONObject quote = (JSONObject) data.get(0);
//			Double currentPrice = (Double) quote.get("p");
//			System.out.println("Current Price: " + currentPrice);
//			Map<String, Object> stockquote = quote;
//			if (currentPrice > 100) {
//				Message alertMessage = new Message();
//				alertMessage.setMessage("Alert triggered");
//				sendAlert(alertMessage);
//			}
//
//		}
//	}
//
//	@MessageMapping("/alert")
//	@SendTo("/chatroom/alert")
//	public Message sendAlert(@Payload Message message) {
//
//		Logger logger = LoggerFactory.getLogger(WebSocketsTrigger.class);
//		logger.info("Inside SendAlert" + message);
//		simpMessagingTemplate.convertAndSend("/chatroom/alert", message);
//		return message;
//	}
//}

@Controller
public class WebSocketsTrigger {
	
	Logger logger = LoggerFactory.getLogger(WebSocketsTrigger.class);
	
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