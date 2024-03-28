// src/components/Chat.js
'use client'
import { useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        // socket.emit('message', newMessage);
        setNewMessage('');
    };

    return (
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
    );
};

export default Chat;