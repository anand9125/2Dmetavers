import { Router } from "express";
import { getAllMaps } from "../../controller/mapController";

const router = Router();

router.get("/", getAllMaps);



export const mapRouter = router;