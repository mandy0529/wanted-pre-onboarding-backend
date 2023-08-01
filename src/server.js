// import packages
import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import helmet from "helmet";
import { db } from "./db/db.js";

// import files
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from "./middlewares/index.js";

// import routes
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";

// app set ---------------------------------------------
const PORT = process.env.PORT ?? 5000;
const app = express();
const base_url = "/api/v1";

// extra packages middleware setup
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(cookieParser());

//  routers
app.use(`${base_url}/user`, userRouter);
app.use(`${base_url}/post`, postRouter);

// 🔥 error middleware 항상 마지막 미들웨어에 위치 🔥
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start server
const startServer = () => {
  db.connect((err) => {
    if (err) {
      console.error("❌ Error connecting to the database:", err.message);
      return;
    }

    console.log("✅ Success connection with db");
    app.listen(PORT, () => {
      console.log(`✅ Listening for server on port ${PORT}`);
    });
  });
};

startServer();

export default app;
