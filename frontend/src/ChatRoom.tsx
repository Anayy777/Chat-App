import React, { useEffect, useRef, useState } from 'react';
import useChatSocket from './useChatSocket';

interface ChatRoomProps {
  roomId: string;
  username: string;
  onLeave: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, username, onLeave }) => {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const feedRef = useRef<HTMLDivElement | null>(null);

  const { messages, status, sendMessage } = useChatSocket({
    url: 'ws://localhost:8080',
    roomId,
    username,
  });

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore -- clipboard access not available
    }
  };

  const statusColor =
    status === 'CONNECTED'
      ? 'var(--color-online)'
      : status === 'CONNECTING'
        ? 'var(--color-accent)'
        : 'var(--color-offline)';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/40 overflow-hidden h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              {status === 'CONNECTED' && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: statusColor }}
                />
              )}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
            </span>
            <button
              type="button"
              onClick={handleCopyRoomId}
              title="Copy room code"
              className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors cursor-pointer shrink-0"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="text-xs tracking-[0.15em]">{roomId}</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">{copied ? '✓' : '⧉'}</span>
            </button>
            <span className="text-sm text-[var(--color-text-muted)] truncate">as {username}</span>
          </div>
          <button
            type="button"
            onClick={onLeave}
            className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-offline)] transition-colors cursor-pointer"
          >
            Leave
          </button>
        </div>

        {/* Messages feed */}
        <div ref={feedRef} className="scroll-thin flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5">
          {messages.length === 0 && (
            <div className="m-auto text-center text-sm text-[var(--color-text-muted)]">
              {status === 'CONNECTED' ? 'No messages yet -- say hello.' : 'Connecting to the room...'}
            </div>
          )}

          {messages.map((msg, index) => {
            if (msg.type === 'SYSTEM_MESSAGE') {
              return (
                <div key={index} className="text-center text-xs text-[var(--color-text-muted)] py-1">
                  {msg.payload.text}
                </div>
              );
            }

            const isMe = msg.payload.username === username;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-[11px] text-[var(--color-text-muted)] mb-0.5 px-1">
                    {msg.payload.username}
                  </span>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-[var(--color-accent)] text-[#121317] rounded-br-sm'
                      : 'bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-bl-sm'
                  }`}
                >
                  {msg.payload.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={status === 'CONNECTED' ? 'Type a message...' : 'Connecting...'}
            disabled={status !== 'CONNECTED'}
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status !== 'CONNECTED' || !inputText.trim()}
            className="shrink-0 rounded-lg px-4 py-2.5 text-sm text-[#121317] bg-[var(--color-accent)] disabled:bg-[var(--color-accent-dim)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed transition-colors cursor-pointer"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
