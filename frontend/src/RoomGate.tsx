import { useState } from 'react';

interface RoomGateProps {
  onEnter: (roomId: string, username: string) => void;
}

type Mode = 'join' | 'create';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 

function generateRoomCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function RoomGate({ onEnter }: RoomGateProps) {
  const [mode, setMode] = useState<Mode>('join');
  const [roomId, setRoomId] = useState('');
  const [createdCode, setCreatedCode] = useState(generateRoomCode());
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  const activeRoomId = mode === 'create' ? createdCode : roomId;
  const canSubmit = username.trim().length > 0 && activeRoomId.trim().length > 0;

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setCopied(false);
  };

  const handleRegenerate = () => {
    setCreatedCode(generateRoomCode());
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — silently ignore, code is still visible
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onEnter(activeRoomId.trim().toUpperCase(), username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          <span
            className="text-lg tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Signal
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/40 overflow-hidden">
          <div className="grid grid-cols-2 p-1.5 gap-1.5 bg-[var(--color-bg)]">
            <button
              type="button"
              onClick={() => handleModeChange('join')}
              className={`py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                mode === 'join'
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Join room
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('create')}
              className={`py-2.5 text-sm rounded-lg transition-colors cursor-pointer ${
                mode === 'create'
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Create room
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-5 flex flex-col gap-4">
            {mode === 'join' ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="roomId" className="text-xs text-[var(--color-text-muted)]">
                  Room code
                </label>
                <input
                  id="roomId"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. 7XQ3PL"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 outline-none focus:border-[var(--color-accent)] transition-colors uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--color-text-muted)]">Your room code</label>
                <div className="flex items-stretch gap-2">
                  <div
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[var(--color-accent)] tracking-[0.2em] text-center"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {createdCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    title="Generate a new code"
                    aria-label="Generate a new code"
                    className="shrink-0 w-11 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Copy code"
                    aria-label="Copy code"
                    className="shrink-0 w-11 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    {copied ? '✓' : '⧉'}
                  </button>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Share this code with anyone you want in the room.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs text-[var(--color-text-muted)]">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="off"
                placeholder="How you'll appear in chat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/60 outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 w-full rounded-lg py-2.5 text-sm text-[#121317] bg-[var(--color-accent)] disabled:bg-[var(--color-accent-dim)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {mode === 'join' ? 'Join room' : 'Create room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
