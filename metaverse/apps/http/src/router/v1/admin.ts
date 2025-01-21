import { Router } from "express";
import { postElements ,updateElement,postAvatar,postMap} from "../../controller/adminController";
 export const adminRouter = Router()



adminRouter.post("/element", postElements)


adminRouter.put("/element/:elementId",updateElement)


adminRouter.post("/avatar",postAvatar)


adminRouter.post("/map",postMap)