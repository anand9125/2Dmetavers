import { Router } from "express";
import { createSpace,deleteSpaceElement, deleteUserSpace, getAllSpace, getSingleSpace, postSpaceElement } from "../../controller/userSpaceController";
import { userMiddleware } from "../../middlewares/user";
export const spaceRouter = Router()

spaceRouter.post("/", userMiddleware, createSpace)


spaceRouter.delete("/element", userMiddleware, deleteSpaceElement )



spaceRouter.delete("/:spaceId", userMiddleware,deleteUserSpace )


spaceRouter.get("/all", userMiddleware,getAllSpace)



spaceRouter.post("/element", userMiddleware, postSpaceElement)



spaceRouter.get("/:spaceId",getSingleSpace)

























