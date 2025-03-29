import { Router } from "express";
import { getMetadataBulk, getUserById, getUserMetadata, updateAvatar, updateMetadata, userSignin, userSignup } from "../../controller/userController";
import { userMiddleware } from "../../middlewares/user";

 const router = Router();


router.post("/signup",userSignup);

router.post("/signin",userSignin);

router.post("/update-metadate",updateMetadata);

router.get("/metadata",userMiddleware,getUserMetadata);

router.post("/:userId",getUserById);

router.get("/metadata/bulk",getMetadataBulk);

router.post("/avatar",userMiddleware,updateAvatar);


 export const userRouter = router;