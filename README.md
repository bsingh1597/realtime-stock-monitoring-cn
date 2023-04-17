# Realtime-Stock-Monitoring-CN
A stock monitoring application for users to monitor multiple stocks and the price fluctuations of the stocks in real time and allows users to share their comments on the stock with other users. Users can set triggers on the stock price and receive alert notifications when trigger price hits on that particular stock. Application has two parts, the client side code and the server side code. 

Server side code is written in Java using Spring boot framework and is responsible for authenticating the clients, connecting to the finnhub api and subscribing to a particular stock for the triggers set by clients and processing the messages sent from finnhub api regarding the stock prices, and sends the alerts once stoploss or target is hit. Server also handles broadcasting the messages for the clients.

Client Side code is written in JavaScript using ReactJS framework and it is responsible for connecting to finnhub api via websockets directly to fetch particular stock price and display to the users. Client also allows users to set triggers on the stock price and sends the requests to the server.

Versions<br>
Java 11<br>
SpringBoot 2.7.9<br>
MySQL 8.0.32<br>
React 18.2.0<br>

Finnhub API is used to fetch the stocks real time data. Below link includes the documentation of Finnhub API.
https://finnhub.io/docs/api/websocket-trades

We have created a Docker file to build and run this application. Use below command line input to execute the docker file in the root directly, which in turn will build the dockers for the server and client and exeucte them. Maven 3 and docker are the requirements to run the application.

chmod -R 777 realtime-stock-monitoring-cn
cd realtime-stock-monitoring-cn
docker build -t stock-streaming-server ./stock-streaming-server
docker build -t stock-streaming-client ./stock-streaming-client
docker-compose up

Alternatively use the steps present in Readme.md in the client and server folders to execute the application.

## Application Overview:
Below is the register page for clients to enter their information which will be encrypted and stored in the database. 
<img width="1429" alt="Register" src="https://user-images.githubusercontent.com/55336660/232323751-cbc2038a-fa56-4ad7-86b0-00f035061820.png">
<br>
Once a client completes the registration, they can now login to the application, below snip shows the login page information.
<img width="1438" alt="login" src="https://user-images.githubusercontent.com/55336660/232323895-6c7cbb4b-bf35-4bfb-b927-5c0f909200cc.png">
<br>
Once user tries to login to the application, authentication is done by the server to validate the user credentials by checking the information present in database. Below snip shows the error message if the user credentials are incorrect.
<img width="1440" alt="authentication" src="https://user-images.githubusercontent.com/55336660/232323994-10fe1b2a-366e-4264-b785-530e32e640ce.png">
<br>
Below snip shows the UI of the application, upon successful login for clients. The UI includes stock search functionality, stock watch table, and broadcast chat functionality. Client side code directly connects to finnhub api via websockets and displays the stock prices in the stock watch table.
<img width="1440" alt="UI" src="https://user-images.githubusercontent.com/55336660/232324079-b9cf2ab6-e17b-494b-bf73-942c080a85cd.png">
<br>
Clients can search for stocks and add it to the stock watch table. Client code will handle this by subscribing this stock to the finnhub api and fetch the quotes sent in by finnhub api and display the stock prices for this newly added stock. Below snip shows the stock search functionality.
<img width="1432" alt="stock droppdown" src="https://user-images.githubusercontent.com/55336660/232325404-bf76cd9c-4e8e-4374-8979-776bca3e84fb.png">
<br>
Below snip shows the newly added Microsoft stock to the stock watch table.
<img width="1440" alt="Adding stock" src="https://user-images.githubusercontent.com/55336660/232325088-ec170efe-df1b-4036-a8bf-5b2815286cf7.png">
<br>
Clients can set the triggers (stopLoss, target) for a particular stock, this request will be sent from client side code to the server. Server side code will handle this request by storing the trigger information in a Hash map and subscribing to the finnhub api for this stock. Server will then process the quotes sent from finnhub api and compare the price with the trigger price and generate the alert to the client once trigger price is reached.
<img width="1440" alt="subscribe stock" src="https://user-images.githubusercontent.com/55336660/232325569-e4dc3101-e732-4894-bc76-b71765c426ae.png">
<br>
Below snip shows the alert message which is displayed for the client once the trigger is hit for a particular stock.
<img width="1433" alt="trigger hit" src="https://user-images.githubusercontent.com/55336660/232325778-59f874d2-dba2-4a37-930a-5441703c6731.png">
<br>
Clients can also use the chat functionality to share their opinions on the stocks, these messages will be broadcasted to online clients. This broadcasting of messages is handled by the server.
<img width="1440" alt="Chat" src="https://user-images.githubusercontent.com/55336660/232325849-5a659c04-bfc5-401e-9902-5d90dccd6f4a.png">






