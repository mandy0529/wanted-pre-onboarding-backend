// import packages
import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import helmet from "helmet";
import db from "./db/db.js";

// app set
const PORT = process.env.PORT ?? 5000;
const app = express();

// extra packages middleware setup
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(cookieParser());

// 🔥 error middleware 항상 마지막 미들웨어에 위치 🔥
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//  routers
app.get("/", (req, res) => {
  res.json({ msg: "welcome minji" });
});

// start server
const startServer = async () => {
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
