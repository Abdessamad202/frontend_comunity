import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

function TestChat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    useEffect(() => {
        // Setup Echo with Pusher
        window.Pusher = Pusher;

        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: "fb4f78300444a170ad34",
            cluster: "mt1",
            forceTLS: true,
        });

        window.Echo.private(`chat.${1}`)
            .listen('.message-sent', (data) => {
                setMessages(prev => [...prev, data.message]);
            });
        return () => {
            window.Echo.leave('chat-channel');
        };
    }, []);

    // Auto scroll to the last message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message to Laravel API
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await axios.post('http://backend_comunity_app.test/api/send/1', {
                message: newMessage
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    // Enter key support
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Real-Time Chat 📨</h2>

            <div style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '10px',
                height: '400px',
                overflowY: 'auto',
                marginBottom: '10px',
                background: '#fafafa'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ padding: '5px 0' }}>
                        <strong>User:</strong> {msg}
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <button
                    onClick={sendMessage}
                    style={{ padding: '8px 16px', borderRadius: '5px', background: '#4f46e5', color: '#fff', border: 'none' }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default TestChat;
