import { useEffect , useState , useRef, useCallback } from "react";

import type { IncomingServerMessage , OutgoingClientMessage , connectionStatus } from "./types/types";

interface useChatSocketProps{
    url : string , 
    username : string , 
    roomId : string
}

export default function useChatSocket({roomId , username , url} : useChatSocketProps){
    const [messages , setMessage] = useState<IncomingServerMessage[]>([]) // an array state to store server messages

    const [status , setStatus] = useState<connectionStatus>("DISCONNECTED")

    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        if(!roomId || !username) return

        queueMicrotask(() => setStatus('CONNECTING'))
        const ws = new WebSocket(url)
        
        wsRef.current = ws
        ws.onopen = () => {
            setStatus("CONNECTED")
            // JOIN ROOM REQUEST

            const joinPayload : OutgoingClientMessage = {
                type : "JOIN_ROOM" , 
                payload : {roomId , username}
            }

            ws.send(JSON.stringify(joinPayload))
        }

        ws.onmessage = (event: MessageEvent) => {
            try {
                const parsedData : IncomingServerMessage = JSON.parse(event.data)
                setMessage((prev) => 
                    [...prev , parsedData]
                )
            } catch (error) {
                console.error("Failed to parse websocket message : " + error)
            }
        };

        ws.onerror = (error) => {
            console.error("Websocket Errror : " , error)
        }

        ws.onclose = () => {
            setStatus('DISCONNECTED')
        }

        return  () => {
            if(ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING){
                ws.close() // this cleanup function ensures the ws connection closes only if the connection is still open or in the process of connecting
            }
        }
    } , [roomId , username , url])

    const sendMessage = useCallback((messageText: string) => {
    if (wsRef?.current?.readyState === WebSocket.OPEN) {
      const payload: OutgoingClientMessage = {
        type: 'CHAT_MESSAGE',
        payload: { message: messageText },
      };
      wsRef?.current.send(JSON.stringify(payload));
    } else {
      console.warn('Cannot send message: WebSocket is not connected.');
    }
  }, []);
    return {messages , status , sendMessage}
}
