import React, { useEffect, useState } from 'react'
import { Chat } from './Chat'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

const ChatRoom = () => {
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }
    const sendValue = (e) => {
        e.preventDefault();
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendPrivateValue = (e) => {
        e.preventDefault();
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const handleInputChange = (field) => (event) => {
        const { value } = event.target;
        setUserData({ ...userData, [field]: value });
    }

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const onError = (err) => {
        console.log(err);

    }

    const registerUser = (event) => {
        event.preventDefault();
        connect();
    }

    return (
        <div className="container">
            {userData.connected ?
                <Chat
                    userData={userData}
                    setUserData={setUserData}
                    stompClient={stompClient}
                    privateChats={privateChats}
                    publicChats={publicChats}
                    tab={tab}
                    setTab={setTab}
                    handleMessage={handleMessage}

                    sendValue={sendValue}
                    sendPrivateValue={sendPrivateValue}
                />
                :
                <>
                    <div class="background">
                        <div class="shape"></div>
                        <div class="shape"></div>
                    </div>
                    <form className='register-form' onSubmit={registerUser}>
                        <h3>Login Here</h3>

                        <label for="username">Username</label>
                        <input type="text" placeholder="Email or Phone" id="username" value={userData.username} onChange={handleInputChange('username')} />

                        <label for="password">Password</label>
                        <input type="password" placeholder="Password" id="password" value={userData.username} onChange={handleInputChange('password')} />

                        <button type='submit'>Log In</button>
                        <div class="social">
                            <div class="go"><i class="fab fa-google"></i>  Google</div>
                            <div class="fb"><i class="fab fa-facebook"></i>  Facebook</div>
                        </div>
                    </form>
                </>


            }
        </div>
    )
}

export default ChatRoom