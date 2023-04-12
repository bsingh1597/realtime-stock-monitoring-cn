import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
// import "../styles/ChatRoom.css"

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        userName: '',
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/webSocket');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
    //  stompClient.subscribe('/client/' + userData.userName + '/private', onPrivateMessage);
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
        switch (reqData.status) {
            case "MESSAGE":
                publicChats.push(reqData);
                setPublicChats([...publicChats]);
                break;
            case "JOIN":
                if (!privateChats.get(reqData.senderName)) {
                    privateChats.set(reqData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
        }
    }

    // const onPrivateMessage = (req) => {
    //     let reqData = JSON.parse(req.body);
    //     if (privateChats.get(reqData.senderName)) {
    //         privateChats.get(reqData.senderName).push(reqData);
    //         setPrivateChats(new Map(privateChats));
    //     } else {
    //         let list = [];
    //         list.push(reqData);
    //         privateChats.set(reqData.senderName, list);
    //         setPrivateChats(new Map(privateChats));
    //     }
    // }

    const onError = (err) => {
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
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

    // const sendPrivateValue = () => {
    //     if (stompClient) {
    //         let textMessage = {
    //             senderName: userData.userName,
    //             receiverName: tab,
    //             message: userData.message,
    //             status: "MESSAGE"
    //         };

    //         if (userData.userName !== tab) {
    //             privateChats.get(tab).push(textMessage);
    //             setPrivateChats(new Map(privateChats));
    //         }
    //         stompClient.send("/app/privateMessage", {}, JSON.stringify(textMessage));
    //         setUserData({ ...userData, "message": "" });
    //     }
    // }

    const handleUserName = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "userName": value });
    }

    const registerUser = () => {
        connect();
    }
    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>Public Chat</li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                    {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}>Send</button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.userName && "self"}`} key={index}>
                                    {chat.senderName !== userData.userName && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.userName && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        {/* <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendPrivateValue}>Send</button>
                        </div> */}
                    </div>}
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.userName}
                        onChange={handleUserName}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        Register
                    </button>
                </div>}
        </div>
    )
}

export default ChatRoom;