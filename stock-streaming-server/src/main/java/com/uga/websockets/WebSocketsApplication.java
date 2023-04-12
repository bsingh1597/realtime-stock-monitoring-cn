package com.uga.websockets;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;

import javax.websocket.DeploymentException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

//import com.uga.websockets.config.StockPriceClient;
import com.uga.websockets.config.WebSocketsTrigger;

@SpringBootApplication
@EnableScheduling
@ComponentScan
public class WebSocketsApplication {

	public static void main(String[] args) throws URISyntaxException, InterruptedException, ExecutionException, DeploymentException, IOException {
		SpringApplication.run(WebSocketsApplication.class, args);
		
		//StockPriceClient client = new StockPriceClient("AAPL");
//		WebSocketsTrigger trigger = new WebSocketsTrigger();
//		trigger.checkStockPrice();

//		StockWebSocketClient clientEndPoint = new StockWebSocketClient(
//				new URI("wss://ws.finnhub.io?token=cgf7cgpr01qllg2ta1qgcgf7cgpr01qllg2ta1r0"));
//		
//		WebSocketClient client = new StandardWebSocketClient();
//
//		WebSocketStompClient stompClinet = new WebSocketStompClient(client);
//
//		StompSessionHandler handler = new StompSessionHandler() {
//			
//			@Override
//			public void handleFrame(StompHeaders headers, Object payload) {
//				// TODO Auto-generated method stub
//				
//			}
//			
//			@Override
//			public Type getPayloadType(StompHeaders headers) {
//				// TODO Auto-generated method stub
//				return null;
//			}
//			
//			@Override
//			public void handleTransportError(StompSession session, Throwable exception) {
//				// TODO Auto-generated method stub
//				
//			}
//			
//			@Override
//			public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload,
//					Throwable exception) {
//				// TODO Auto-generated method stub
//				
//			}
//			
//			@Override
//			public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
//				// TODO Auto-generated method stub
//				
//			}
//		};
//
//		ListenableFuture<StompSession> sessionAsync = stompClinet.connect("", handler);
//		StompSession session = sessionAsync.get();
//		session.subscribe("", handler);
//		while (true) {
//			session.send("", "");
//			Thread.sleep(10000);
//		}
	}
}
