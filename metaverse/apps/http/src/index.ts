import express, { Router } from "express"
import { router } from "./router/v1";
// import client from "@repo/db/client"

const app = express();

app.use("/api/v1",router)
app.use(express.json());

app.listen(3000, () => console.log('Server is running'));
