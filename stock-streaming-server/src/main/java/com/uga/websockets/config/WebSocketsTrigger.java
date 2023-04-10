package com.uga.websockets.config;

import java.lang.reflect.Type;
import java.net.URI;
import java.nio.ByteBuffer;

import jakarta.websocket.ClientEndpoint;
import jakarta.websocket.CloseReason;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.MessageHandler;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.WebSocketContainer;

import org.springframework.lang.Nullable;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.HashMap;


//@ClientEndpoint
//public class WebSocketsTrigger {
//
//	private Session userSession = null;
//	private MessageHandler messageHandler;
//
//	public WebSocketsTrigger(URI endpointURI) {
//		try {
//			WebSocketContainer container = ContainerProvider.getWebSocketContainer();
//			container.connectToServer(this, endpointURI);
//		} catch (Exception e) {
//			throw new RuntimeException(e);
//		}
//	}
//
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
//	public void onMessage(String message) {
//		if (this.messageHandler != null) {
//			this.messageHandler.handleMessage(message);
//		}
//	}
//
//	@OnMessage
//	public void onMessage(ByteBuffer bytes) {
//		System.out.println("Handle byte buffer");
//	}
//
//	/**
//	 * register message handler
//	 *
//	 * @param msgHandler
//	 */
//	public void addMessageHandler(MessageHandler msgHandler) {
//		this.messageHandler = msgHandler;
//	}
//
//	/**
//	 * Send a message.
//	 *
//	 * @param message
//	 */
//	public void sendMessage(String message) {
//		this.userSession.getAsyncRemote().sendText(message);
//	}

//	public static interface MessageHandler {
//
//		public void handleMessage(String message);
//	}
//	public void WebsocketTrigger() {
//		try {
//			// WebSocketClient clientEndPoint = new
//			// WebSocketClient(URI("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"));
//
//			WebSocketClient client = new StandardWebSocketClient();
//			WebSocketStompClient stompClinet = new WebSocketStompClient(client);
//			StompSessionHandler handler = new StompSessionHandler() {
//
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
//					// TODO Auto-generated method stub
//
//				}
//
//				public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
//					// TODO Auto-generated method stub
//
//				}
//			};
//			CompletableFuture<StompSession> sessionAsync = stompClinet
//					.connectAsync("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0", handler, "");
//			StompSession session = sessionAsync.get();
//			session.subscribe("", handler);
//
//			while (true) {
//				session.send("", "");
//				Thread.sleep(10000);
//			}
//			Map<String, Object> quote = restTemplate.getForObject(apiUrl, HashMap.class);
//	        double stockPrice = (double) quote.get("c");
//	        if (stockPrice > alertThreshold) {
//	            sendAlert();
//	        }
//	    }
	
//	    private void sendAlert() {
//	        //add code to send alert notification here
//	        System.out.println(alertMessage);
//	    }
//		} catch (InterruptedException ex) {
//			System.err.println("InterruptedException exception: " + ex.getMessage());
//		} catch (ExecutionException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}
//}
		

@Component
public class WebSocketsTrigger {

    private double alertThreshold = 100.0; //set the alert threshold here
    private String stockSymbol = "BINANCE:BTCUSDT"; //set the stock symbol here
    private String finnhubApiKey = "cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"; //set your Finnhub API key here
    private String alertMessage = "Stock price of " + stockSymbol + " has crossed the alert threshold of " + alertThreshold;
    @Scheduled(fixedDelay = 60000) //run the code every minute
    
    public void checkStockPrice() {
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://finnhub.io/api/v1/quote?symbol=" + stockSymbol + "&token=" + finnhubApiKey;
        Map<String, Object> quote = restTemplate.getForObject(apiUrl, HashMap.class);
        double stockPrice = (double) quote.get("c");
        if (stockPrice > alertThreshold) {
            sendAlert();
        }
    }

    private void sendAlert() {
        //add code to send alert notification here
        System.out.println(alertMessage);
    }
}