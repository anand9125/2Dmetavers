import { OutgoingMessage } from "./types";
import type { User } from "./User";
export class RoomManager {  //RoomManager class that manages users within different "rooms" each identified by a spaceId 
    rooms:Map<string,User[]> = new Map(); // string is spaceID and value is array of user
    static instacne :RoomManager  //  A static property that holds the singleton instance of RoomManager
   
    private constructor(){
        this.rooms = new Map();  //It initializes the rooms map.
    }
    //singlation Implementation
    static getInstance(){ //getInstance: A static method that ensures only one instance of RoomManager exists
        if(!this.instacne){
            this.instacne = new RoomManager();
        }
        return this.instacne;
    }
    public removeUser(spaceId:string,user:User){  //removeUser: A public method to remove a User from a room identified by spaceId
     if(!this.rooms.has(spaceId)){
        return;
     }
     this.rooms.set(spaceId,(this.rooms.get(spaceId)?.filter((u)=>u.id!=user.id )??[]));  //It filters the array of users for the given spaceId and removes the user if found. If no users remain for the spaceId, it removes the entry from the rooms map.  //The filter method creates a new array with all elements that pass the test implemented by the provided function.  //The arrow function u=>u.
    }
        public addUser(spaceId:string,user:User){  //addUser: A public method to add a User to a room identified by spaceId
        if(!this.rooms.has(spaceId)){  //First, it checks if the rooms map already has an entry for spaceId
            this.rooms.set(spaceId,[user]); //if not, it creates a new entry with the spaceId sets the value as an array containing the user.
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);  //If spaceId already exists, it appends the user to the existing array of users.
        
    }
    public broadcast (message:OutgoingMessage,user:User,roomId:string){  //this is the broadcast function that roommanger has so that whenever  user recive the events like a movement its can just tell the Roommanager  hey move the certain location 
        if(!this.rooms.has(roomId)){
            return;
    }
    this.rooms.get(roomId)?.forEach((u)=>{
        if(u.id!=user.id){
         u.send(message);
        }
    })
}}







//The RoomManager class is designed to manage users within different "rooms," where each room is identified by a spaceId.
// // It follows the Singleton pattern, ensuring that only one instance of RoomManager exists throughout the application. 
// This class also provides methods for adding users to rooms and broadcasting messages to users within a specific room.