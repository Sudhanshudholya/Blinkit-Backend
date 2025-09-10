import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import uploadRouter from "./routes/upload.route.js";
import subCategoryRouter from "./routes/subCategory.route.js";
import productRouter from "./routes/product.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(cookieParser());


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
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/file", uploadRouter)
app.use('/api/v1/subCategory', subCategoryRouter)
app.use('/api/v1/product', productRouter)

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port  : ${PORT}`);
});
