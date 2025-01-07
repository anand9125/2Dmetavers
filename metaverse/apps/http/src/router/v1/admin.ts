import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin";
import { CreateAvatarScheme, CreateElementScheme, CreateMapSchema, UpdateElementScheme } from "../../types";
import { PrismaClient } from "@prisma/client"
 export const adminRouter = Router()
 const client = new PrismaClient()
 adminRouter.post("/element",adminMiddleware,async(req,res)=>{
   const parseData = CreateElementScheme.safeParse(req.body);
   if(!parseData.success){
     res.status(400).json({
         message:"Invalid inputs"
     })
     return;
   }
   const createElement = await client.element.create({
     data:{
         imageUrl:parseData.data.imageUrl,
         width:parseData.data.width,
         height:parseData.data.height,
         static:parseData.data.static
     }
   })
   res.json({
     id:createElement.id,
   })
})
 
 adminRouter.put("/element/:elementId",adminMiddleware,async(req,res)=>{
    const parseData = UpdateElementScheme.safeParse(req.body)
    if(!parseData.success){
        res.json({
            message:"Inavalid element"
        })
        return;
    }
    const updateElement = await client.element.update({
        where:{
            id:req.params.elementId,
        },data:{
            imageUrl:parseData.data.imageUrl
        }
    })
    res.json({
        message:"Element updated successfully"
    })
 })   

 adminRouter.post("avatar",adminMiddleware,async(req,res,)=>{
    const parseData = CreateAvatarScheme.safeParse(req.body);
    if(!parseData.success){
         res.status(400).json({
             message:"Invalid inputs"
        })
         return;
     }
     const createAvatar = await client.avatar.create({
         data:{
            name:parseData.data.name,
            imageUrl:parseData.data.imageUrl
         }
     })
     res.json({
         id:createAvatar.id
     })
 })
 adminRouter.post("/map",adminMiddleware,async(req,res)=>{
    const parseData = CreateMapSchema.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({
            message:"Validation failed"
        })
        return;
    }
    const createMap = await client.map.create({
        data:{
            name:parseData.data.name,
            width:parseInt(parseData.data.dimensions.split("x")[0]),
            height:parseInt(parseData.data.dimensions.split("x")[1]),
            thumbnail:parseData.data.thumbnail,
            mapElements: {                            //Use create inside the mapElements relation to insert multiple related mapElements records at the same time as creating the Map.
                create: parseData.data.defaultElements.map(element => ({
                  elementId: element.elementId,
                  x: element.x,
                  y: element.y
             }))
        }
    }})
    res.json({
        id:createMap.id
    })
 })