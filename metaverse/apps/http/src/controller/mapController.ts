import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { CreateMapSchema } from "../types";

const client = new PrismaClient()

export const getAllMaps = async (req:Request, res:Response) => {
    try{
        const maps = await client.map.findMany();
        res.json({ maps });
    }
    catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}

export const createMap = async (req:Request, res:Response) => {
    try{
        const parsedData = CreateMapSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const map = await client.map.create({
        data: {
          name: parsedData.data.name,
          width: parseInt(parsedData.data.dimensions.split("x")[0]),
          height: parseInt(parsedData.data.dimensions.split("x")[1]),
          thumbnail: parsedData.data.thumbnail,
          mapElements: {
            create: parsedData.data.defaultElements?.map(e => ({
              element: { connect: { id: e?.elementId } }, // Connect existing element
              x: e?.x ?? 0, // Provide default values if undefined
              y: e?.y ?? 0,
              static: e?.static ?? false,
            }))
          }
        }
      });
      

    res.json({
        id: map.id
    })
    }
    catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}   