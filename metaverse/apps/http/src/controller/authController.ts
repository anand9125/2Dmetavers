import { Request,Response } from "express";


import { SigninScheme,SigupScheme } from "../types/index";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const client = new PrismaClient()

export const userSignup =async (req:Request, res:Response) => {
        
    const parseData = SigupScheme.safeParse(req.body)       
    if(!parseData.success){
         res.status(403).json({
            message:"invalid input",
        })
        return;
    }
    const hashPassword = await bcrypt.hash(parseData.data.password,10)
    try{
        const existingUser = await client.user.findUnique({
             where: { email:parseData.data.email } 
        });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" })
            return;
        }
        const user = await client.user.create({
            data:{
                username:parseData.data.username,
                email:parseData.data.email,
                password:hashPassword,
                role:"User"
            }
        })
        console.log(res)
        const token = jwt.sign({userId :user.id,role:user.role},JWT_PASSWORD)

        res.json({
            user:{
                id:user.id,
                username:user.username,
                email:user.email,
                role:user.role
            },
            token
      })

    }
    catch(e){
       res.status(500).json({
          mesage:"Internal Server Error"
       })
    }
    
}

export const userSignin = async(req:Request, res:Response) => {
    const parseData = SigninScheme.safeParse(req.body);
    if(!parseData.success){
        res.status(403).json({
            message:"Invalid inputs"
        })
        return;
    }
    if( parseData.data.adminPassword && parseData.data.adminPassword !==process.env.ADMIN_SECRET){
         res.status(406).json({
            message:"Invalid admin credentials"
        })
        return;
    }
    try{
          const user = await client.user.findUnique({
             where:{
                 email:parseData.data.email
             }
          })
          if(!user){
              res.status(404).json({
                  message:"User is not found please Signup "
              })
            return;
          }
         const isValid = await bcrypt.compare(parseData.data.password, user.password)
          if(!isValid){
              res.status(401).json({
                 message:"Invalid password"
              })
            return;
          }
          if (parseData.data.adminPassword === process.env.ADMIN_SECRET) {
            await client.user.update({
              where: { email: parseData.data.email },
              data: { role: 'Admin' },
            });
          } 
          const token = jwt.sign({userId :user.id,role:user.role},JWT_PASSWORD)
          res.json({
            user:{
                id:user.id,
                username:user.username,
                email:user.email,
                role:user.role
            },
            token
        })
      }
    catch(e){
         res.status(500).json({
            message:"Internal error occurred"
        })
    }
    
}