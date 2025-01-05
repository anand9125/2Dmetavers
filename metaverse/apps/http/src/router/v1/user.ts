import { Router } from "express";
import { UpdateMetadataScheme } from "../../types";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../../middlewares/user";
 export const userRouter = Router()
 const client = new PrismaClient()

 userRouter.post("/metadata",userMiddleware,async(req,res)=>{
    const parseData = UpdateMetadataScheme.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({
            message:"Invalid inputs"
        })
        return;
    }
    
    const response = await client.user.update({
        where:{
            //i want usser id How to get user id user is only sending to me headers for id use middlewares
            id:req.userId
        },
        data:{
                avatarId:parseData.data.avatarId
        }
    })
    res.json({
        message:"Metadata updated successfully"
   })
})
 userRouter.get("/metadata/bulk",async(req,res)=>{
    const userIdString = (req.query.ids ?? "[]") as string
    const userIds = userIdString.slice(1,userIdString ?.length -2).split(",")
    const metadata = await client.user.findMany({
        where:{
            id:{
                in:userIds
            }
        },select:{
            avatar:true,
            id:true
        }
    })
    res.json({
       avatars:metadata.map(m=>({
        userId :m.id,
        avatarId:m.avatar?.imageUrl,
       }))
    })
  


 })
  
 //req.query.ids: This accesses the query parameter ids from the request URL
 //?? "[]": The nullish coalescing operator (??) checks if req.query.ids is null or undefined.
 //slice(1, ...) means we are extracting a substring starting from index 1 and going up to userIdString.length - 2.
 // // This is effectively removing the first character ([) and the last character (])