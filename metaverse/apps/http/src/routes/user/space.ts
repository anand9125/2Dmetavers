import { Router } from "express";
import { userMiddleware } from "../../middlewares/user";
import { createSpace, createSpaceElement, deleteSpace, deleteSpaceElement, getAllSpaces, getSpace } from "../../controller/spaceController";

const router = Router();

router.post("/create-space", userMiddleware, createSpace)

router.post("/create-spaceElement", userMiddleware, createSpaceElement)

router.delete("/delete/:spaceId", userMiddleware, deleteSpace)

router.delete("/delete-spaceElement",userMiddleware, deleteSpaceElement)

router.get("/all", userMiddleware, getAllSpaces)

router.get("/:spaceId", userMiddleware, getSpace)



export const spaceRouter = router;