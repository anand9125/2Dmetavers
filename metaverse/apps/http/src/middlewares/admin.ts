import { NextFunction,Request,Response } from "express"
import { JWT_PASSWORD, JWT_SECRET } from "../config"
import jwt from "jsonwebtoken"
interface Decodetoken{
    role:string;
    userId :string

}
declare global{
    namespace Express{
        export interface Request{
            userId :string,
            role:"Admin" | "User"
        }
    }
}
export const adminMiddleware = (req :Request,res :Response,next:NextFunction)=>{
    const header = req.headers["authorization"] 
    const token  = header?.split(" ")[1]  // this will create an array that will seprater [Barrer , token] like this and we can use token 
    if(!token){
        res.status(403).json({
            message:"Unauthorized"
        })
        return;
    }
    try{  const decode = jwt.verify(token,JWT_SECRET) as Decodetoken
        if(decode.role != "Admin"){
            res.status(403).json({
                message:"Unauthorized"
            })
        }
       //if its docoded and verifed ki its admin then we put this userID of in request for forther use
       req.userId =decode.userId  //The problme is ye karoge to typeScri will begian to comaplian  ki this request object dosenot have key called userId 
       // So we have to overRide this  global type (express request  object change type globally  or How to extend the Express Request object in TypeScript)
       //DO simple declear global express object  and add what ever properties you want
       next()
    }
    catch(e){
        res.status(401).json({
            message:"Unauthorized"
        })
    }
}