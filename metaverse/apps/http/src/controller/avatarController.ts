import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import { CreateAvatarSchema } from "../types";

const client = new PrismaClient()

export const getAllAvatars = async (req:Request, res:Response) => {
    try{
        const avatars = await client.avatar.findMany();
        res.json({
            avatars: avatars.map(({ id, imageUrl, name }) => ({
                id,
                imageUrl: imageUrl ?? "", // Default to empty string if null
                name: name ?? "Unnamed",  // Default to "Unnamed" if null
            })),
        });
    }
    catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}

export const createAvatar = async (req:Request, res:Response) => {
    try{ const parsedData = CreateAvatarSchema.safeParse(req.body)
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
    }catch(e){
        res.status(400).json({message: "Internal server error"})
    }
}