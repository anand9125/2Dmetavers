import WebSocket from "ws"; 
interface RoomManagerUser {
    userId: string;
    name: string;
    peerId: string;
    ws: WebSocket;
  }
  
   export  class RoomManger{
    private roomByspace:Map<string,Map<string,RoomManagerUser>> = new Map();   //structer spaceId -> userId -> user
    private wsToUserMap:Map<WebSocket,{userId:string;spaceId:string}> = new Map();
    private static instance: RoomManger;
    public static getInstance(){
        if(!this.instance){
            this.instance=new RoomManger();
        }
        return this.instance;
    }
    addUser(
        userId:string,
        name:string,
        peerId:string,
        spaceId:string,
        ws:WebSocket
    ){
        // Remove any existing entries for this user
        this.removeUserByUserId(userId);
     
         // Get or create the meeting room for this space
        if(!this.roomByspace.has(spaceId)){
            this.roomByspace.set(spaceId,new Map());
        }
        const room = this.roomByspace.get(spaceId);

        // Add the new user to the room
        room!.set(userId,{userId,name,peerId,ws});
        this.wsToUserMap.set(ws,{userId,spaceId});

        console.log(`User ${userId} added to space ${spaceId}`);

    }
    removeUserByUserId(userId:string){
        // Search in all spaces for this user
        for(const [spaceId,room] of this.roomByspace.entries()){
            const user = room.get(userId);
            if(user){
                this.wsToUserMap.delete(user.ws);
                room.delete(userId);
                console.log(`User ${userId} removed from space ${spaceId}`);
            if(room.size === 0){
                this.roomByspace.delete(spaceId);
            }
            return {userId,spaceId};
            }
        }
    return null;  
    }

    removeUserByWebSocket(ws:WebSocket){
       const userInfo = this.wsToUserMap.get(ws) as {userId:string;spaceId:string};
       if(userInfo){
           this.removeUserByUserId(userInfo.userId);
       
       const{userId,spaceId}=userInfo;
       const room = this.roomByspace.get(spaceId);
       if(room){
           room.delete(userId);
           if(room.size === 0){
               this.roomByspace.delete(spaceId);
           }
       }
       this.wsToUserMap.delete(ws);
       console.log(`User ${userId} removed from space ${spaceId}`);
       
       return userInfo;
    }
    return null

   }

   findUserByWebSocket(ws:WebSocket):RoomManagerUser|undefined{
       const userInfo = this.wsToUserMap.get(ws);
       if(userInfo){
        const {userId,spaceId} = userInfo;
        const room = this.roomByspace.get(spaceId);
        if(room){
            const user = room.get(userId);
            if(user){
                return user;
            }
        }
       }
       return undefined;
   }
   getUserInSpace(spaceId:string,userId:string):RoomManagerUser[]{
    const room = this.roomByspace.get(spaceId);
    if(room){
        return Array.from(room.values()).filter(u=>u.userId === userId);
    }
    return [];
   }
   getUsersForClientDisplay(spaceId:string){
    const room = this.roomByspace.get(spaceId);
    if(!room) return {}
   
    return Object.fromEntries(
        Array.from(room.entries()).map(([id,user]) => [
            id,{
                userId:user.userId,
                name:user.name,
                peerId:user.peerId,
            }
        ])
    )
   }
   broadcastMessage(spaceId:string,message:any,excludeUserId?:string){
    const room = this.roomByspace.get(spaceId);
    if(!room) return;
    const users = Array.from(room.values()).filter(
    u=>u.userId !== excludeUserId);
   
    users.forEach((user) => {
        console.log(message);
        user.ws.send(JSON.stringify(message));
      });
    }
}