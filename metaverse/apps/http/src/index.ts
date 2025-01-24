import express from "express";
import { router } from "./router/v1/authRoute";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5174', // Frontend URL
    credentials: true,
  }));
  
app.use(express.json()); 

app.use("/api/v1", router);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
