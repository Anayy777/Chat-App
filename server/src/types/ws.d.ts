import { WebSocket , WebSocketServer } from "ws";

export interface CustomWebSocket extends WebSocket {
    roomId ?: string , 
    username ?: string , 
    isAlive ?: boolean
}

export type IncomingMessage = 
    | {
        type : 'JOIN_ROOM', 
        payload : {
            roomId : string 
            username : string
        }
    } 
    | {
        type : 'MESSAGE' , 
        payload : {
            message : string
        }
    }


export type OutgoingMessage = 
    {
        type : "NEW_MESSAGE" | "SYSTEM_MESSAGE" , 
        payload : {
            username ?: string
            text : string
            timestamp ?:string
        }
    }