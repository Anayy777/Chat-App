import { WebSocketServer , WebSocket, on } from "ws";


import { IncomingMessage , OutgoingMessage , CustomWebSocket } from "./types/ws";
import { NodeHandle } from "typescript/unstable/sync";

const wss = new WebSocketServer({port : 8080})

const rooms = new Map<string , Set<CustomWebSocket>>()

/* 
"room124" : Set(1) {
    Websocket {username : <> , currRoom : <>}
}
*/

wss.on("connection" , (socket) => {
    
    socket.on("message" , (message : string) => {

        try {
            const data : IncomingMessage = JSON.parse(message.toString())

            handleMessage(socket , data)
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

function handleMessage(ws : CustomWebSocket , data : IncomingMessage){
    switch (data.type) {
        case 'JOIN_ROOM': {
            const {roomId , username} = data.payload

            // attach info to socket

            ws.roomId = roomId
            ws.username = username

            // if room dont exist
            if(!rooms.has(roomId)){
                rooms.set(roomId , new Set<CustomWebSocket>())
            }

            rooms.get(roomId)!.add(ws) // add the client to the designated room id

            // !. means we are telling ts trust me this expression will not be null ior undefined stop telling me about type safety

            broadcastToRoom(roomId , {
                type : 'SYSTEM_MESSAGE' , 
                payload : {text : `${username} joined the room`}
            })
            break;
        }
        case 'MESSAGE' :  {
            if(!ws.username || !ws.roomId) return
            
            broadcastToRoom(ws.roomId , {
                type : "NEW_MESSAGE" , 
                payload : {
                    username : ws.username , 
                    text : data.payload.message , 
                    timestamp : new Date().toISOString()
                }
            })
            break
        }
    }


}

function broadcastToRoom(roomId : string , messageObj : OutgoingMessage){

    const roomSockets = rooms.get(roomId)
    if(!roomSockets)return
    const msg = JSON.stringify(messageObj)

    for (const element of roomSockets) {
        if(element.readyState === WebSocket.OPEN){
            element.send(msg)
        }
    }    
}

function handleDisconnect(ws : CustomWebSocket) : void{
    const roomId = ws.roomId
    if(!roomId || !rooms.has(roomId))return
    
    const roomSockets = rooms.get(roomId)!

    roomSockets.delete(ws)

    broadcastToRoom(roomId , {
        type : 'SYSTEM_MESSAGE' , 
        payload : {
            text : `${ws.username} disconnected`
        }
    })

    if(roomSockets.size === 0){
        rooms.delete(roomId)
    }

}