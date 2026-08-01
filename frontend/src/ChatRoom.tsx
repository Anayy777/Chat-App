  import React, { useState } from 'react';
  import useChatSocket  from './useChatSocket';

  interface ChatRoomProps {
    roomId: string;
    username: string;
  }

  export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, username }) => {
    const [inputText, setInputText] = useState('');
    
    // Initialize our custom WebSocket hook
    const { messages, status, sendMessage } = useChatSocket({
      url: 'ws://localhost:8080',
      roomId,
      username,
    });

    const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;

      sendMessage(inputText);
      setInputText('');
    };

    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* Connection Status Bar */}
        <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Room:</strong> {roomId} | <strong>User:</strong> {username} |{' '}
          <span style={{ color: status === 'CONNECTED' ? 'green' : 'red' }}>
            {status}
          </span>
        </div>

        {/* Messages Feed */}
        <div
          style={{
            border: '1px solid #ccc',
            height: '300px',
            overflowY: 'scroll',
            padding: '10px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {messages.map((msg, index) => {
            if (msg.type === 'SYSTEM_MESSAGE') {
              return (
                <div key={index} style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                  <em>{msg.payload.text}</em>
                </div>
              );
            }

            const isMe = msg.payload.username === username;
            return (
              <div
                key={index}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  backgroundColor: isMe ? '#007bff' : '#e9ecef',
                  color: isMe ? '#fff' : '#000',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  maxWidth: '70%',  
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                    {msg.payload.username}
                  </div>
                )}
                <div>{msg.payload.text}</div>
              </div>
            );
          })}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} style={{ display: 'flex', marginTop: '10px', gap: '8px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={status === 'CONNECTED' ? 'Type a message...' : 'Connecting...'}
            disabled={status !== 'CONNECTED'}
            style={{ flex: 1, padding: '8px' }}
          />
          <button type="submit" disabled={status !== 'CONNECTED'} style={{ padding: '8px 16px' }}>
            Send
          </button>
        </form>
      </div>
    );
  };