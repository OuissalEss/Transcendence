// src/components/Chat.js
'use client'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import DashboardLayout from '../layouts/LayoutDefault';

const socket = io('http://localhost:3000/');

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message: string) => {
            setMessages([...messages, message]);
        });
        }, [messages]);

    const sendMessage = () => {
        socket.emit('message', newMessage);
        setNewMessage('');
    };

    return (
        <DashboardLayout>
            <div>
                <div className="chat">
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                        ))}
                </div>
                <div className="input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </DashboardLayout>
        );
};

export default Chat;