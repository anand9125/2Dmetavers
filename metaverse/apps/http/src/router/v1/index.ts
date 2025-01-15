import { Router } from "express";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { SigninScheme,SigupScheme } from "../../types";

import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config";
export const router = Router();
const client = new PrismaClient()
import { userSignup } from "../../controller/authController";


router.post("/signup",userSignup);


router.get("/elements", async(req, res) => {
    const elemets = await client.element.findMany()
    res.json({
        elemets: elemets.map(el=>({
            id:el.id,
            imageUrl:el.imageUrl,
            width:el.width,
            height:el.height,
            static:el.static

        }))
    })
   
});

router.get("/avatars",async(req,res)=>{
    const avatar = await client.avatar.findMany()
    res.json({
        avatar:avatar.map(av=>({
          id:av.id,
          name:av.name,
          imageUrl:av.imageUrl  
        }))
    })
})




router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);

