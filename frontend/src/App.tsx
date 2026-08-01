// App.tsx
import { useState } from 'react';
import { ChatRoom } from './ChatRoom';

export default function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  if (joined) {
    return <ChatRoom roomId={roomId} username={username} />;
  }

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Join Chat</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '8px' }}
      />
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: '8px' }}
      />
      <button 
        disabled={!username.trim() || !roomId.trim()} 
        onClick={() => setJoined(true)}
        style={{ padding: '8px 16px' }}
      >
        Join Room
      </button>
    </div>
  );
}