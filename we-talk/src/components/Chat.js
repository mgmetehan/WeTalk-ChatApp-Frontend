import React, { useState } from 'react';

export const Chat = ({ userData, setUserData, stompClient, privateChats
    , publicChats, setTab, tab, handleMessage, sendValue, sendPrivateValue }) => {

    return (
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name, index) => (
                        <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab === "CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat, index) => (
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <form onSubmit={sendValue} className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                    <button type="submit" className="send-button-public" >send</button>
                </form>
            </div>}
            {tab !== "CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat, index) => (
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <form onSubmit={sendPrivateValue} className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                    <button className="send-button-private" type='submit'>send</button>
                </form>
            </div>}
        </div>
    )
}