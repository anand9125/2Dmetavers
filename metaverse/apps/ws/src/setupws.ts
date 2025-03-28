import WebSocket, { WebSocketServer } from "ws"; // Import ws WebSocket
import { RoomManger } from "./RoomManager";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { PrismaClient } from "@prisma/client"
import { SpaceCache } from "./Space";
import { UserManager } from "./UserManager";


const client = new PrismaClient()
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
  interface User {
    id: string;
    userId: string;
    spaceId: string;
    ws: WebSocket;
    position: { x: number; y: number };
    name: string;
    peerId: string;
    isGuest?: boolean;
  }
  
interface ChatMessage {
    type: "chat";
    payload: {
      userId: string;
      message: string;
      timestamp: number;
      username?: string;
    };
  }
  
async function fetchSpace(spaceId: string) {
 return await SpaceCache.getInstance().getSpace(spaceId);
}
function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 12);
}

function calulateSpawnPosition(spaceId:string,space:any):{x:number,y:number}{
     const spaceWidth = space.width;
     const spaceHeight = space.height;
     if (!spaceWidth || !spaceHeight || spaceHeight <= 0 || spaceWidth <= 0) {
        console.error(`Invalid space dimensions: width=${spaceWidth}, height=${spaceHeight}`);
        return { x: 0, y: 0 };
      }
     const userInSpace = UserManager.getInstance().getUsersInSpace(spaceId);
     const occupiedSpace = new Set(userInSpace.map(
        user => `${user.position.x},${user.position.y}`
    ));
    const staticElements = space.elements
    .filter((el:any)=>el.element.static)
    .map((el:any)=>{`${el.element.x},${el.element.y}`});
      // Define the area to avoid
  const avoidArea = {
    minX: 1,
    maxX: 12,
    minY: 12,
    maxY: 18,
  };

  let x, y;
  let attempts = 0;
  const maxAttempts = spaceHeight * spaceWidth;
  let isInAvoidArea = false;

  do {
    x = Math.floor(Math.random() * spaceWidth);
    y = Math.floor(Math.random() * spaceHeight);

    // Check if position is within the area to avoid
    isInAvoidArea =
      x >= avoidArea.minX &&
      x <= avoidArea.maxX &&
      y >= avoidArea.minY &&
      y <= avoidArea.maxY;

    attempts++;

    if (attempts > maxAttempts) {
      console.warn(
        `Could not find unoccupied position after ${maxAttempts} attempts`
      );
      return { x: 0, y: 0 };
    }
  } while (occupiedSpace.has(`${x},${y}`) || isInAvoidArea);

  return { x, y };
}



function setupwss(wss:WebSocketServer){
    wss.on("connection",async function(ws:WebSocket){
        ws.on("message",async function(data){
            console.log("hii i am reched")
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
                     break;
                    }
                    case"join" :{
                        const{spaceId,token ,peerId,isGuest,guestName}=message.payload;

                        let userId:string;
                        let name:string;
 
                        if(isGuest){
                            //handle guest join
                         userId = `guest-${token}`; // Using the guest token as userId
                         name = guestName; 
                        
                        }else{
                            try{
                                //handle normal user join
                                const decode = jwt.verify(token, JWT_PASSWORD) as {userId:string};

                                if(!decode.userId){
                                    ws.close();
                                    return;
                                }
                                userId = decode.userId;
                                 
                                const user = await client.user.findUnique({
                                    where:{
                                        id:userId
                                    }
                                })
                                if(!user){
                                    ws.close();
                                    return;
                                }
                                name=user.username || "Anonymous";
                            }catch(e){
                                ws.close();
                                return;
                            } 
                        }
                        const space = await fetchSpace(spaceId);
                        if(!space){
                            ws.close();
                            return;
                        }
                        //find and remove existing connection
                        


                        //generate spwan position
                        const spawnPosititon = calulateSpawnPosition(spaceId,space);

                        const user:any={
                            id:generateUniqueId(),
                            userId,
                            spaceId,
                            ws,
                            position:spawnPosititon,
                            name,
                            peerId,
                            isGuest:isGuest||false
                        }

                        UserManager.getInstance().addUser(user);

                        const userList = UserManager.getInstance().getUsersInSpace(spaceId);

                        //send updated user list 
                        ws.send(JSON.stringify({
                            type:"space-joined",
                            payload:{
                                  spawn:spawnPosititon,
                                  newUserPosition:userList.map((user)=>({
                                    userId:user.userId,
                                    position:user.position,
                                    name:user.name,
                                    peerId:user.peerId,
                                    isGuest:user.isGuest
                                  })),
                                  userId,
                                  name,
                                  peerId,
                                  isGuest                            
                            }
                        })
                       )
                      //boradcast new user to others
                      
                      UserManager.getInstance().broadcastToSpace(spaceId,{
                        type:"user-joined",
                        payload:{
                            userId,
                            name,
                            peerId,
                            isGuest
                        }
                       },userId
                      );
                      break;
                    }

                    case "movement":{
                        const {x,y,direction} = message.payload;
                        const movingUser = UserManager.getInstance().findUserByWebsocket(ws);
                        if(movingUser){
                            const space = await fetchSpace(movingUser.spaceId);
                            if (!space) {
                                console.error(`Space not found for id: ${movingUser.spaceId}`);
                                return;
                              }
                            
                            //check space bounds
                            if(x < 0 || x > space.width || y < 0 || y > space.height){
                                console.error(`Invalid position: ${x},${y}`);
                                return;
                            }
                            //check for static elements
                            const staticElements = space.elements.filter((el:any)=>el.element.static);

                            const isStaticElement = staticElements.some((el:any)=>el.x===x && el.y===y);  
                            
                            if (isStaticElement) {
                                console.warn(`Cannot move to static element at: (${x}, ${y})`);
                                return;
                            }

                            //check for other users
                            const userInSpace = UserManager.getInstance().getUsersInSpace(movingUser.spaceId);

                            const isOccupiedByUser = userInSpace.some(
                                (user:any)=>
                                 user.userId !== movingUser.userId &&
                                 user.position.x === x &&
                                 user.position.y === y
                            );
                            if (isOccupiedByUser) {
                                console.warn(`Cannot move to occupied position: (${x}, ${y})`);
                                return;
                            }

                            //update user posoition

                            movingUser.position={x,y};

                            //Broadcast new position to other users

                            UserManager.getInstance().broadcastToSpace(
                                movingUser.spaceId,{
                                    type:"movement",
                                    payload:{
                                        userId:movingUser.userId,
                                        position:{x,y},
                                        direction,
                                        peerId:movingUser.peerId,
                                        isGuest:movingUser.isGuest,
                                        name:movingUser.name
                                    }
                                }
                            )                        
                        }
                        break;
                    }
                    case "chat":{
                        const chattingUser = UserManager.getInstance().findUserByWebsocket(ws);
                        if(chattingUser){
                            if(!message.payload || !message.payload.message){
                                console.error("Invalid chat message");
                                return;
                            }
                            const chatMessage:ChatMessage = {
                                type:"chat",
                                payload:{
                                    userId:chattingUser.userId,
                                    message:message.payload.message,
                                    timestamp:Date.now(),
                                    username:chattingUser.name
                                }
                            }
                            UserManager.getInstance().broadcastChatMessage(chattingUser.spaceId,chatMessage);
                        }
                        break;
                    }
                    case "space-update":{
                        const updatingUser= UserManager.getInstance().findUserByWebsocket(ws);
                        if(updatingUser && updatingUser.spaceId){
                        // Invalidate the cache for this space to force a refresh
                        SpaceCache.getInstance().invalidateCache(updatingUser.spaceId);
                        }
                        break;
                    }
                }
            }
            catch(e){
                console.error("webdocket error",e);
                ws.close();
            }
        })
        ws.on("close",function(){
            const user = UserManager.getInstance().findUserByWebsocket(ws);
            if(user){
                  UserManager.getInstance().broadcastToSpace(user.spaceId,{
                    type:"user-left",
                    payload:{
                        userId:user.userId,
                        name:user.name,
                        peerId:user.peerId,
                        isGuest:user.isGuest
                    }
                });
                UserManager.getInstance().removeUser(user.id);
            }
        })
    })
}

export default setupwss;
