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
router.post("/signup",async (req, res) => {
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
             where: { username:parseData.data.username } 
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" })
            return;
        }
        const user = await client.user.create({
            data:{
                username:parseData.data.username,
                password:hashPassword,
                role:parseData.data.type=="admin" ?"Admin":"User"
            }
        })
        console.log(res.status)
        res.status(201).json({
            
            message: "User created successfully",
            userId : user.id
        })
    }
    catch(e){
       res.status(400).json({
          mesage:"Internal Server Error"
       })
    }
    
});
router.post("/signin", async(req, res) => {
    const parseData = SigninScheme.safeParse(req.body);
    if(!parseData.success){
        res.status(403).json({
            message:"Invalid inputs"
        })
        return;
    }
    try{
          const user = await client.user.findUnique({
             where:{
                 username:parseData.data.username
             }
          })
          if(!user){
              res.status(403).json({
                  message:"User is not found please Signup "
              })
            return;
          }
         const isValid = await bcrypt.compare(parseData.data.password, user.password)
          if(!isValid){
              res.status(403).json({
                 message:"Invalid password"
              })
            return;
          }
          const token = jwt.sign({userId :user.id,role:user.role},JWT_PASSWORD)
          res.json({
          token
        })
    }
    catch(e){
         res.status(400).json({
            message:"Internal error occurred"
        })
    }
    
});
;
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

