import express from "express";

import dotenv from "dotenv";
import { userRouter } from "./routes/user/user";
import { elementRouter } from "./routes/user/element";
import { spaceRouter } from "./routes/user/space";
import { mapRouter } from "./routes/user/map";
import { avatarRouter } from "./routes/user/avatar";
import { adminRouter } from "./routes/admin/adminRouter";


const app = express();
const cors = require('cors');

dotenv.config();

app.use(cors());


app.use(
  cors({
    origin: "*", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
  
app.use(express.json()); 

app.use("/api/v1/user", userRouter);

app.use("/api/v1/space", spaceRouter);

app.use("/api/v1/element", elementRouter);

app.use("/api/v1/map", mapRouter);

app.use("/api/v1/avatar", avatarRouter);


app.use("/api/v1/admin", adminRouter);

console.log(
  app._router.stack
    .map((r: any) => (r.route ? r.route.path : null))
    .filter(Boolean)
);



app.listen(3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
