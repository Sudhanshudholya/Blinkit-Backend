import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(cookieParser());

// app.use(morgan());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 9090;

app.get("/", (req, res) => {
  res.send({
    status: true,
    message: `Server is running on port ${PORT}`,
  });
});

app.use("/api/v1/user", userRouter);

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port  : ${PORT}`);
});
