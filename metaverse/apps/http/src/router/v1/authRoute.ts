import { Router } from "express";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { PrismaClient } from "@prisma/client";
export const router = Router();
const client = new PrismaClient()
import { userSignin, userSignup } from "../../controller/authController";


router.post("/signup",userSignup);

router.post("/signin",userSignin);


router.get("/elements", async (req, res) => {
    const elements = await client.element.findMany()

    res.json({elements: elements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
})

router.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({avatars: avatars.map(x => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name
    }))})
})



router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);

