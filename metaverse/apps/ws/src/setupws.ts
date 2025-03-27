import WebSocket, { WebSocketServer } from "ws"; // Import ws WebSocket
import { RoomManger } from "./RoomManager";
interface MeetingRoomChatMessage {
    type: "meeting-room-chat";
    payload: {
      message: string;
      sender: string;
      senderId: string;
      timestamp: number;
      spaceId: string;
    };
  }
function setupwss(wss:WebSocketServer){
    wss.on("connection",function(ws:WebSocket){
        ws.on("message",function(data){
            try{
                const message = JSON.parse(data.toString());
                
                //Handle all messages types

                switch(message.type){
                    case "enter-meeting-room":{
                        const {spaceId,userId,name,peerId} = message.payload;

                        //add user to room with the ws
                        RoomManger.getInstance().addUser(userId,name,peerId,spaceId,ws);
                        
                        // Send updated meeting room users list to all clients in this space
                        const userList = RoomManger.getInstance().getUsersForClientDisplay(spaceId);
                        RoomManger.getInstance().broadcastMessage(spaceId,{
                         type:"user-list",payload:{
                            users:userList,
                            spaceId:spaceId
                         }
                        });
                        break;                              
                    }

                    case "leave-meeting-room":{
                        const {spaceId,userId} = message.payload;
                        RoomManger.getInstance().removeUserByUserId(userId);
                            
                        // Notify all clients about the user leaving
                            RoomManger.getInstance().broadcastMessage(spaceId,{
                                type:"leave-meeting-room",
                                payload:{
                                   userId,
                                   spaceId
                                }
                            });
                        //send updated user list
                        const userList = RoomManger.getInstance().getUsersForClientDisplay(spaceId);
                        RoomManger.getInstance().broadcastMessage(spaceId,{
                         type:"meeting-room-users",
                         payload:{
                            users:userList,
                            spaceId:spaceId
                         }
                        });
                        break;
                    }
                    case "meeting-room-chat":{
                      
                     // Find the sender using websocket
                     const user = RoomManger.getInstance().findUserByWebSocket(ws);
                     const {spaceId} = message.payload;

                     if(user && message.payload.message){
                        const chatMessage:MeetingRoomChatMessage = {
                            type:"meeting-room-chat",
                            payload:{
                                message:message.payload.message,
                                timestamp:Date.now(),
                                sender:user.name,
                                senderId:user.userId,
                                spaceId:spaceId 
                            }
                         }
                     }
                    }
                }

            }
        })
    })
}
