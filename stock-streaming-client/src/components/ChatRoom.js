import React, { useState, useEffect } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ChatRoom.css"
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

var stompClient = null;
const ChatRoom = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    const [publicChats, setPublicChats] = useState([]);
    const [alertMessage, setAlertMessage] = useState([]);
    const [alertMessages, setAlertMessageData] = useState({
        message: ''
    })
    const [userData, setUserData] = useState({
        userName: sessionStorage.getItem("user"),
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
        console.log("connected in user chatroom: " + sessionStorage.getItem("user"))
        console.log("logged in user token chatroom: " + sessionStorage.getItem("jwtToken"))
        // setUserData({...userData, userName: sessionStorage.getItem("user")})
        connect();
    }, []);

    const connect = () => {
        console.log("Inside connect function")
        const jwtToken = sessionStorage.getItem("jwtToken")
        let Sock = new SockJS('http://localhost:8082/webSocket'
            // , null, {
            //     headers: {'Authorization': 'Bearer '+ jwtToken}}
        );
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
        console.log("After setting the connection")
    }

    const onConnected = () => {
        console.log("On Connected")
        setUserData({ ...userData, connected: true });
        setAlertMessageData({ ...alertMessages })
        console.log("Alertmin onConnected" + alertMessages.message);
        console.log("OnConnected: " + JSON.stringify(userData));
        // stompClient.subscribe('/chatroom/alert', onAlertMessageReceived);
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        userJoin();
    }

    const userJoin = () => {
        console.log("OnConnected2: " + JSON.stringify(userData));
        let textMessage = {
            senderName: sessionStorage.getItem("user"),
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(textMessage));
    }

    const onMessageReceived = (req) => {
        let reqData = JSON.parse(req.body);
        console.log("ABC XYZ", JSON.stringify(req.body));
        switch (reqData.status) {
            case "MESSAGE":
                publicChats.push(reqData);
                setPublicChats([...publicChats]);
                break;
            case "JOIN":
                console.log("Join1 message: ", JSON.stringify(userData))
                if (reqData.senderName !== userData.userName) {
                    reqData.message = "Joined the Chatroom";
                    publicChats.push(reqData);
                    setPublicChats([...publicChats]);
                }
                break;
            case "LEFT":
                console.log("Logout message: ", JSON.stringify(userData))
                if (reqData.senderName !== userData.userName) {
                    publicChats.push(reqData);
                    setPublicChats([...publicChats]);
                }
                break;
        }
    }

    const onAlertMessageReceived = (req) => {
        let reqData = JSON.parse(req.body);
        console.log("ALERTTT!!", JSON.stringify(req.body));
        alertMessage.push(reqData);
        setAlertMessage([...alertMessage]);
    }

    const onError = (err) => {
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
        // setAlertMessageData({...alertMessages, "message": value})
    }
    const sendValue = () => {
        console.log("Inside send message")
        if (stompClient) {
            let textMessage = {
                senderName: userData.userName,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(textMessage);
            stompClient.send("/app/message", {}, JSON.stringify(textMessage));
            // setUserData({ ...userData, "message": "" });
        }
    }
    const handleUserName = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "userName": value });
    }
    const handleUserLogout = () => {
        console.log("Inside logout message")

        sessionStorage.clear()
        localStorage.clear()

        if (stompClient) {
            let textMessage = {
                senderName: userData.userName,
                status: "MESSAGE"
            };
            console.log(textMessage);
            stompClient.send("/app/logout", {}, JSON.stringify(textMessage));
            setUserData({ ...userData, "message": "" });
            from
                ? navigate(from, { replace: true })
                : window.location.replace("/login");
        }

    }

    return (
        <div>
            {
                userData.connected &&
                <div className="chat-box" >
                    <div className="chat-content">
                        <h4>Global Chat</h4>
                        <Button style={{ "fontSize": "12px" }} variant='outlined' color='error' onClick={handleUserLogout}> Logout </Button>
                        <div className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <ul>
                                    <li className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                        {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                </ul>
                            ))}
                            {Array.from(alertMessage).map((chat, index) => (
                                <ul>
                                    <li className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                        {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                </ul>
                            ))}
                        </div>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter message" value={userData.message} onChange={handleMessage} />
                            {/* <button type="button" className="send-button" onClick={sendValue}>Send</button> */}
                            <Button variant="contained" endIcon={<SendIcon />} onClick={sendValue}>
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatRoom;