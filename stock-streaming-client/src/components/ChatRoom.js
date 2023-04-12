import React, { useState, useEffect } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import "../styles/ChatRoom.css"

var stompClient = null;
const ChatRoom = () => {

    const [publicChats, setPublicChats] = useState([]);
    const [alertMessage, setAlertMessage] = useState([]);
    const [alertMessages, setAlertMessageData] = useState({
        message: ''
    })
    const [userData, setUserData] = useState({
        userName: '',
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {

        console.log("logged in user: "+sessionStorage.getItem("user"))
        setUserData({...userData, userName: "test"})
        connect();
    }, []);

    const connect = () => {
        console.log("Inside connect function")
        let Sock = new SockJS('http://localhost:8082/webSocket');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        setAlertMessageData({ ...alertMessages })
        console.log("Alertmin onConnected" + alertMessages.message);
        console.log("OnConnected: " + userData.userName);
        stompClient.subscribe('/chatroom/alert', onAlertMessageReceived);
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        userJoin();
    }

    const userJoin = () => {
        let textMessage = {
            senderName: userData.userName,
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
                if (reqData.senderName !== userData.userName) {
                    reqData.message = "Joined the Chatroom";
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
        if (stompClient) {
            let textMessage = {
                senderName: userData.userName,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(textMessage);
            stompClient.send("/app/message", {}, JSON.stringify(textMessage));
            setUserData({ ...userData, "message": "" });
        }
    }
    const handleUserName = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "userName": value });
    }

    // const registerUser = () => {
    //     connect();
    // }
    return (
        <div className="container">
            {
            // userData.connected &&
                <div className="chat-box">
                    <div className="chat-content">
                        <h4>Global Chat</h4>
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <ul className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                    {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                </ul>
                            ))}
                            {Array.from(alertMessage).map((chat, index) => (
                                <ul className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                    {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                </ul>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}>Send</button>
                        </div>
                    </div>
                </div>
                // :
                // <div className="register">
                //     <input
                //         id="user-name"
                //         placeholder="Enter your name"
                //         name="userName"
                //         value={userData.userName}
                //         onChange={handleUserName}
                //         margin="normal"
                //     />
                //     <button type="button" onClick={registerUser}>
                //         Register
                //     </button>
                // </div>
                }
        </div>
    )
}

export default ChatRoom;