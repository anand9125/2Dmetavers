import { Router } from "express";
import { AddElementScheme, CreateSpaceScheme, DeleteElementSchema } from "../../types";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../../middlewares/user";
export const spaceRouter = Router()
const client = new PrismaClient()

spaceRouter.post("/",userMiddleware ,async(req,res)=>{
    const parseData = CreateSpaceScheme.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({
            message:"Invalid inputs"
        })
        return;
    }
    if(!parseData.data.mapId){
       const space =  await client.space.create({
            data:{
                name:parseData.data.name,
                width:parseInt(parseData.data.dimensions.split("x")[0]), //extracts the width from a string representing dimensions in the format "width x height"
                                                                        //The split method splits the string by the delimiter "x", resulting in an array where the first element ([0]) is the width
                height:parseInt(parseData.data.dimensions.split("x")[1]),
                creatorId:req.userId
            }
        });
        res.json({
           space : space.id
        })
    }
    //what if user give me map id means user selected the map which is created in past by the user so 
    const map = await client.map.findUnique({
        where:{
            id:parseData.data.mapId
        },
        select:{
            mapElements:true,
            width:true,
            height:true
        }
    })
    if(!map){
        res.json({
            message:"Map is not found"
        })
        return
    }
   let spac1= await client.$transaction(async()=>{
        const space = await client.space.create({
            data:{
                name:parseData.data.name,
                width:map.width,
                height:map.height,
                creatorId:req.userId,
            }
        })
        //now this space element needs to bunch of space elemet that we storing in the spacelement table
        await client.spaceElements.createMany({  // insert multiple records into the spaceElements table in a single database operation.
            data:map.mapElements.map(e=>({  //map.mapElements is an array of object and map function is used to transform each element in the map.mapElements array into a new object that fits the required format for insertion into the spaceElements table
                spaceId:space.id, // comes from the newly created space used to link each element to this specific space. 
                elementId:e.elementId,
                x:e.x ?? 0, //nullish coalescing opretor This ensures that if either x or y is null or undefined, they will default to 0. 
                y:e.y ?? 0,
               
            }))
        })
        return space;
    })

  res.json({
    spaceId: spac1.id
  })
})

spaceRouter.delete("/:spaceId",async(req,res)=>{
    const space = await client.space.findUnique({
        where:{
            id:req.params.spaceId  //spaceId parameter in the URL, 
        },
        select:{
            creatorId:true
        }
    })
    if(!space){
        res.status(404).json({
            message:"Space not found"
        })
        return;
    }
    if(!space || space.creatorId!== req.userId){
        res.status(403).json({
            message:"Unauthorized"
        })
        return;
    }
    await client.space.delete({
        where:{
            id:req.params.spaceId
        }
    })
    res.json({
        message:"Space deleted successfully"
    })
})
spaceRouter.get("/all",async(req,res)=>{
    const space = await client.space.findMany({
        where:{
            creatorId:req.userId
        }
    });
    res.json({
        space:space.map(space=>({
            name:space.name,
            id:space.id,
            dimension:`${space.height}x${space.width}`,
            thumbnail:space.thumbnail
        }))
    })
})
spaceRouter.post("/element",userMiddleware ,async(req,res)=>{
    const parseData = AddElementScheme.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({
            message:"Invalid Inputs"
        })
        return;
    }
    const space = await client.space.findUnique({
        where:{
            id: parseData.data.spaceId,
            creatorId:req.userId
        },select:{
            width:true,
            height:true
        }
    })
    if(!space){
        res.status(404).json({
            message:"Space not found"
        })
        return;
    }
     await client.spaceElements.create({
        data:{
            spaceId:req.body.space,
            elementId:req.body.elementId,
            x:req.body.x,
            y:req.body.y
        }
    })
    res.json({
        message:"Elements added successfully"
    })

})

spaceRouter.delete("/element",userMiddleware,async(req,res)=>{
    //simply said ish id ka spaceelemet hai delete kar do 
    //delete tha space element of is spacific id
    const parseData = DeleteElementSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(400).json({
            message:"Invalid inputs"
        })
        return;
    }
    const spaceElement = await client.spaceElements.findUnique({
        where:{
            id:parseData.data.id
        },include:{
            space:true
        }
    })
    if(!spaceElement){
        res.status(404).json({
            message:"Space Element not found"
        })
        return;
    }
   
     await client.spaceElements.delete({
       where:{
        id:parseData.data.id
       }
   })
    res.json({
    message:"Space Element deleted successfully"
   })
})
spaceRouter.get("/:spaceId",async (req, res) =>{
    const space = await client.space.findUnique({
        where:{
            id:req.params.spaceId
        },
        include:{
            elements:{
                include:{
                    element:true
                }
            }
        }

    })
    if(!space){
        res.status(400).json({message:"space is not found"})
    }
    res.json({
        "dimension": `${space?.height} x${space?.width}`,
         element: space?.elements.map((e)=>({
            id:e.id,
            element:{
                id:e.element.id,
                imageUrl:e.element.imageUrl,
                width:e.element.width,
                height:e.element.height,
                static:e.element.static
            },
            x:e.x,
            y:e.y,
            elementId:e.elementId

        }))
    })
})


























