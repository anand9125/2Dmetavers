import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import {  JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"
import jwt  from "jsonwebtoken"
const client = new PrismaClient()

function getRandomString(length:number){  //This function takes an argument length and generates a random string of that length.
     const character = "ASDSASDFSDFASFSFSF"
     let result = "";
     for(let i=0; i<length; i++){
         result += character.charAt(Math.floor(Math.random() * character.length));
     }
     return result;
}
export class User {  //User class represents a user connected via a WebSocket
    public id:string;
    public userId?:string
    private spaceId?:string;  //every user also store a spaceId they are currently in 
    //every user have x and y also
    private x:number;
    private y:number;
    constructor( private ws: WebSocket) { //constructor takes a WebSocket instance (ws) and assigns it to a private property ws. This WebSocket instance will be used to communicate with the client.
         this.id =getRandomString(10);
         this.x=0;
         this.y=0;
         this.ws=ws;
         this.initHandlers();
    }
    initHandlers() {  //initHandlers method sets up a message event listener for the WebSocket (ws).becuse client will sent us two events 1st join the events and  2nd movements
        this.ws.on("message", async(data) => {
            const parseData = JSON.parse(data.toString());
            switch(parseData.type){
                case "join":
                    const spaceId = parseData.payload.spaceId;
                   const token= parseData.payload.token;
                   const userId = (jwt.verify(token,"secretpassword")as JwtPayload).userId
                   if(!userId){
                    this.ws.close()
                        return;

                   }
                    const space = await client.space.findFirst({
                        where:{
                            id:spaceId
                        }
                    })
                    if(!space){
                        this.ws.close()
                        return;
                    }
                    this.spaceId = spaceId;
                    RoomManager.getInstance().addUser(spaceId, this)
                    this.x =Math.floor(Math.random()*space.width)
                    this.y = Math.floor(Math.random()*space.height!)
                    this.send({
                        type:"space joined",
                        playload:{
                            spawn:{
                                x: this.x,
                                y:this.y
                            },
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id)?.map((u) => ({id: u.id})) ?? []
                        }
                    })

                    //whenever user join everyone should khnows user join 
                    RoomManager.getInstance().broadcast({
                        type:"user joined",
                        payload:{
                            userId:this.id,
                            x:this.x,
                            y:this.y
                        }
                    }, this, this.spaceId!)
                     break;
                    case "move" :
                        const moveX = parseData.payload.x
                        const moveY = parseData.payload.y
                        const xDisplacment=Math.abs(this.x-moveX);
                        const yDisplacement=Math.abs(this.y-moveY);
                        if((xDisplacment==1 && yDisplacement ==0) ||(xDisplacment==0 && yDisplacement==1))
                        this.x=moveX.x
                        this.y=moveY.y
                        RoomManager.getInstance().broadcast({
                            type:"move",
                            payload:{
                                x:this.x,
                                y:this.y
                            }
                        }, this, this.spaceId!)
                      return; 
            }
            this.send({
                type:"movement-rejected",
                payload:{
                    x:this.x,
                    y:this.y

                }
            })
        });
    }
    destroy(){
        RoomManager.getInstance().broadcast({
            type:"user left",
            payload:{
                userId:this.userId
            }
        },this, this.spaceId!)

        RoomManager.getInstance().removeUser(this.spaceId!,this,)
    }
    send(payload:OutgoingMessage){
        this.ws.send(JSON.stringify(payload));  //send method sends a message (payload) to the client.
    }

}