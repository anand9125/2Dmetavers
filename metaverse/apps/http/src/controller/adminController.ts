import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin"
import { CreateAvatarScheme, CreateElementScheme, CreateMapSchema, UpdateElementScheme } from "../types/index";
import { PrismaClient } from "@prisma/client"
 const client = new PrismaClient()
 export const adminRouter = Router()
 import { Request,Response } from "express";

export const postElements =async (req:Request, res:Response) => {
    const parsedData = CreateElementScheme.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl,
        }
    })

    res.json({
        id: element.id
    })
}
export const updateElement = (req:Request, res:Response) => {
    const parsedData = UpdateElementScheme.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({message: "Element updated"})
}

export const postAvatar =  async (req:Request, res:Response) => {
    const parsedData = CreateAvatarScheme.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({avatarId: avatar.id})
}

export const postMap = async(req:Request,res:Response)=>{
    const parseData = CreateMapSchema.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({
            message:"Validation failed"
        })
        return;
    }
    const map = await client.map.create({
        data: {
            name: parseData.data.name,
            width: parseInt(parseData.data.dimensions.split("x")[0]),
            height: parseInt(parseData.data.dimensions.split("x")[1]),
            thumbnail: parseData.data.thumbnail,
            mapElements: {
                create: parseData.data.defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })

    res.json({
        id: map.id
    })
}