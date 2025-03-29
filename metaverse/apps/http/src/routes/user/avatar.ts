import { Router } from "express";
import { getAllAvatars } from "../../controller/avatarController";

const router = Router();

router.get("/", getAllAvatars);



export const avatarRouter = router;