# Realtime-Stock-Monitoring-CN
A stock monitoring application for users to monitor multiple stocks and the price fluctuations of the stocks in real time and allows users to share their comments on the stock with other users. Users can set triggers on the stock price and receive alert notifications when trigger price is hit on that particular stock. Application has two parts, the client side code and the server side code. 

Server side code is written in Java Springboot and is responsible in authenticating the clients, connecting to the finnhub api via websockets and subscribing to a particular stock for the triggers set by clients and processing the messages sent from finnhub api regarding the stock prices, and sends the alerts once stoploss or target is hit.  Server also handles broadcasting the messages for the clients.

Client Side code is written in react.js and it is responsible for connecting to finnhub api via websockets directly to fetch particular stock price and display to the users. Client also allows users to set triggers on the stock price and sends the requests to the server.

Versions
Java 11
SpringBoot 2.7.9
MySQL 8.0.32
React 18.2.0

Finnhub API is used to fetch the stocks real time data. Below link includes the documentation of Finnhub API.
https://finnhub.io/docs/api/websocket-trades






