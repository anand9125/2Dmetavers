import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../middlewares/user";
import { Request,Response } from "express";
import { hash, compare } from "../types/scrypt";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema, UpdateMetadataSchema } from "../types";
import { JWT_PASSWORD } from "../config";
const client = new PrismaClient();

export const userSignup= async (req:Request, res:Response) => {
    console.log(req.body);
    console.log("inside signup");
    // check the user
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log("parsed data incorrect");
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    console.log(parsedData);
    const hashedPassword = await hash(parsedData.data.password);
    try {
      const user = await client.user.create({
        data: {
          name: parsedData.data.name,
          username: parsedData.data.username,
          password: hashedPassword,
          role: req.body=== "admin" ? "Admin" : "User"
        },
      });
      res.json({
        userId: user.id,
      });
      console.log("inside signup");
    } catch (e) {
      console.log("erroer thrown");
      console.log(e);
      res.status(400).json({ message: "User already exists" });
    }
}

export const userSignin = async (req: Request, res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(403).json({ message: "Validation failed" });
      return;
    }
  
    try {
      const user = await client.user.findUnique({
        where: {
          username: parsedData.data.username,
        },
      });
  
      if (!user) {
        res.status(403).json({ message: "User not found" });
        return;
      }
      const isValid = await compare(parsedData.data.password, user.password);
  
      if (!isValid) {
        res.status(403).json({ message: "Invalid password" });
        return;
      }
  
      const token = jwt.sign(
        {
          name: user.name,
          userId: user.id,
          role: user.role,
        },
        JWT_PASSWORD
      );
  
      res.json({
        token,
      });
    } catch (e) {
      res.status(400).json({ message: "Internal server error" });
    }
}

export const updateMetadata = async (req: Request, res: Response) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log("parsed data incorrect");
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    try {
      const user = await client.user.update({
        where: {
          id: req.userId,
        },
        data: {
          avatarId: parsedData.data.avatarId,
          name: parsedData.data.name,
        },
        select: {
          username: true,
          name: true,
          avatarId: true,
          id: true,
          role: true,
        },
      });
      res.json({ message: "Metadata updated", user });
    } catch (e) {
      console.log("error");
      res.status(400).json({ message: "Internal server error" });
    }
}

export const  getUserMetadata = async (req:Request, res:Response) => {
   console.log("inside get user metadata");
  try{
      console.log(req.userId);
        const user = await client.user.findUnique({
            where: {
                id: req.userId,
            },
            });
            console.log("user", user);
    
            if (!user) {
            res.status(404).json({ message: "User not found 2" });
            return;
            }
            if(user.avatarId === null){
            res.json({
                user,
                avatar: null
            })
            return
           }
            const avatar = await client.avatar.findFirst({
            where: { id: user.avatarId },
            });
            console.log("avatar", avatar);
    
            res.json({
            user,
            avatar,
            });
    }
    catch(e){
        res.status(400).json({message: "Internal server error"})
    }
} 

export const getUserById = async (req:Request, res:Response) => {
  const userId = req.params.userId;
  console.log(userId);
   try{
    const user = await client.user.findUnique({
        where: {
          id: userId,
        },
      });
      console.log("user", user);
    
      if (!user) {
        res.status(404).json({ message: "User not found 1" });
        return;
      }
    
      res.json({
        user,
      });
   }
   catch(e){
       res.status(400).json({message: "Internal server error"})
   }
}

export const getMetadataBulk = async (req:Request, res:Response) => {
    const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString?.length - 1).split(",");
  console.log(userIds);
  const metadata = await client.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      avatar: true,
      id: true,
    },
  });

  res.json({
     avatars: metadata.map((m) => ({
      userId: m.id,
      avatarId: m.avatar?.imageUrl,
    })),
  });
}

export const updateAvatar = async (req:Request, res:Response) => {
    const avatarId = req.body.avatarId;
    console.log("got kbskvksd", avatarId);
    try {
      const user = await client.user.update({
        where: {
          id: req.userId,
        },
        data: {
          avatarId: avatarId,
        },
        select: {
          avatarId: true,
        },
      });
      console.log(user);
  
      const avatar = await client.avatar.findFirst({
        where: {
          id: avatarId,
        },
      });
  
      res.json({
        avatar,
      });
    } catch (error) {
      res.json(error);
    }
}