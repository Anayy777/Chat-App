// App.tsx
import { useState } from 'react';
import { RoomGate } from './RoomGate';
import { ChatRoom } from './ChatRoom';

export default function App() {
  const [session, setSession] = useState<{ roomId: string; username: string } | null>(null);

  if (session) {
    return (
      <ChatRoom
        roomId={session.roomId}
        username={session.username}
        onLeave={() => setSession(null)}
      />
    );
  }

  return <RoomGate onEnter={(roomId, username) => setSession({ roomId, username })} />;
}
