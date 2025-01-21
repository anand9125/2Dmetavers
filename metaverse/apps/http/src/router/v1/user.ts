import { Router } from "express";
import { UpdateMetadataScheme } from "../../types";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../../middlewares/user";
 export const userRouter = Router()
 const client = new PrismaClient()

 userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataScheme.safeParse(req.body)       
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }
    try {
        await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })
        res.json({message: "Metadata updated"})
    } catch(e) {
        console.log("error")
        res.status(400).json({message: "Internal server error"})
    }
})
userRouter.get("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    console.log(userIds)
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})
  
 //req.query.ids: This accesses the query parameter ids from the request URL
 //?? "[]": The nullish coalescing operator (??) checks if req.query.ids is null or undefined.
 //slice(1, ...) means we are extracting a substring starting from index 1 and going up to userIdString.length - 2.
 // // This is effectively removing the first character ([) and the last character (])