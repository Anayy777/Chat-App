import { WebSocketServer , WebSocket, on } from "ws";


import { IncomingMessage , OutgoingMessage , CustomWebSocket } from "./types/ws";
import { NodeHandle } from "typescript/unstable/sync";

const wss = new WebSocketServer({port : 8080})

const rooms = new Map<string , Set<CustomWebSocket>>()

wss.on("connection" , (socket) => {
    
    socket.on("message" , (message : string) => {

        try {
            const data : IncomingMessage = JSON.parse(message.toString())

            handleMessage(data)
        } catch (error) {
            console.error("Invalid JSON received")
        }
    })

    socket.on("error" , () => {

    })

    socket.on("close" , () => {
        handleDisconnect(socket)
    })

} )

function handleMessage(){
    
}

function handleDisconnect(){

}