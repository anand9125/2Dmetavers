import { Request,Response } from "express";


import { SigninScheme,SigupScheme } from "../types/index";

import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const client = new PrismaClient()

export const userSignup =async (req:Request, res:Response) => {
    const parseData = SigupScheme.safeParse(req.body)
    if(!parseData.success){
         res.status(400).json({
            message:"Invalid inputs"
        })
        return;
    }
    const hashPassword = await bcrypt.hash(parseData.data.password,10)
    try{
        const existingUser = await client.user.findUnique({
             where: { email:parseData.data.email } 
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" })
            return;
        }
        const user = await client.user.create({
            data:{
                username:parseData.data.username,
                email:parseData.data.email,
                password:hashPassword,
                role:parseData.data.type=="admin" ?"Admin":"User"
            }
        })
        console.log(res.status)
        res.status(201).json({
            user : user
        })
     
    }
    catch(e){
       res.status(400).json({
          mesage:"Internal Server Error"
       })
    }
    
}