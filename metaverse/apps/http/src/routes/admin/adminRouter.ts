import { Router } from "express";
import { createElement, updateElement } from "../../controller/element.Controler";
import { createAvatar } from "../../controller/avatarController";
import { createMap } from "../../controller/mapController";
import { adminMiddleware } from "../../middlewares/admin";
import { userMiddleware } from "../../middlewares/user";

const router = Router();

router.post("/create-element",adminMiddleware, createElement)

router.put("/element/:elementId",adminMiddleware, updateElement)

router.post("/create-avatar",adminMiddleware, createAvatar)

router.post("/create-map",userMiddleware, createMap)





export const adminRouter = router;