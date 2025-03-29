import { Router } from "express";
import { getAllElements } from "../../controller/element.Controler";
import { userMiddleware } from "../../middlewares/user";

const router = Router();

router.get("/", getAllElements);


export const elementRouter =   router;