import WebSocket from "ws";
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
  
export class UserManager{
    public users:Map<string,User> = new Map<string,User>();
    private spaceUsers:Map<string,Set<string>> = new Map<string,Set<string>>();
    private static instance: UserManager;
    public static getInstance(){
        if(!this.instance){
            this.instance=new UserManager();
        }
        return this.instance;
    }
    public addUser(user:User){
        // Remove any existing entries for this user in the same space
        const existingUsers = Array.from(this.users.values()).filter(
            u => u.userId === user.userId
                && u.spaceId === user.spaceId
        );
        existingUsers.forEach(u => this.removeUser(u.id));

        // Add the user 
        this.users.set(user.id, user);
        if (!this.spaceUsers.has(user.spaceId)) {
            this.spaceUsers.set(user.spaceId, new Set<string>());
        }
        this.spaceUsers.get(user.spaceId)?.add(user.id);
    }

    removeUser(userId:string){
        const user = this.users.get(userId);
        if (user) {
            this.users.delete(userId);
            this.spaceUsers.get(user.spaceId)?.delete(userId);
            console.log(`Removed user ${userId} from space ${user.spaceId}`);
  
        }
    }
    getUsersInSpace(spaceId:string):{
        userId: string;
        position: { x: number; y: number };
        name: string;
        peerId: string;
        isGuest?: boolean;
    }[]{
        const userIds = this.spaceUsers.get(spaceId) || new Set()
        return Array.from(userIds)
        .map((id) => this.users.get(id))
        .filter(Boolean)
        .map((user) => ({
          userId: user!.userId,
          position: user!.position,
          name: user!.name,
          peerId: user!.peerId,
          isGuest: user!.isGuest,
        }));
    }
    findUserByWebsocket(ws:WebSocket):User|undefined{
        return Array.from(this.users.values()).find(u => u.ws === ws);
    }
    findUserById(userId:string ,spaceId:string):User|undefined{
        return Array.from(this.users.values())
        .find(u => u.userId === userId && u.spaceId === spaceId);
    }
    broadcastToSpace(spaceId:string,message:any,exclude?:string){
        const users = Array.from(this.users.values())
            .filter(u => u.spaceId === spaceId && u.id !== exclude);
        
        users.forEach(u => u.ws.send(JSON.stringify(message)));
    }
    broadcastChatMessage(spaceId:string,message:ChatMessage){
        const users = Array.from(this.users.values())
            .filter(u => u.spaceId === spaceId);
        
        users.forEach(u => u.ws.send(JSON.stringify(message)));
    }
}


