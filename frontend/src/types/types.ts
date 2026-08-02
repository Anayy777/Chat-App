export type OutgoingClientMessage =
  | {
      type: 'JOIN_ROOM';
      payload: {
        username: string;
        roomId: string;
      };
    }
  | {
      type: 'MESSAGE';
      payload: {
        message: string;
      };
    };

export type IncomingServerMessage = {
  type: 'SYSTEM_MESSAGE' | 'NEW_MESSAGE';
  payload: {
    username?: string;
    text: string;
    timestamp?: string;
  };
};

export type connectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';