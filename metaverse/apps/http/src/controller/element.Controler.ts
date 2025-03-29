import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { CreateElementSchema, UpdateElementSchema } from "../types";

const client = new PrismaClient()

export const getAllElements = async (req:Request, res:Response) => {
    try{
        const elements = await client.element.findMany()
        res.json({elements: elements.map((e:{id:string,imageUrl:string,width:number,height:number,static:boolean}) => ({
            id: e.id,
            imageUrl: e.imageUrl,
            width: e.width,
            height: e.height,
            static: e.static
        }))})
    }
    catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}

export const createElement = async (req:Request, res:Response) => {
    try{const parsedData = CreateElementSchema.safeParse(req.body)
        console.log(req.body);
        
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
    }catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}

export const updateElement = async (req:Request, res:Response) => {
    try{ const parsedData = UpdateElementSchema.safeParse(req.body)
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
    }catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}