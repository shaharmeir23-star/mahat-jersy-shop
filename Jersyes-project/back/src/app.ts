
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { loggerMiddleware } from "./middleware/Logger.middleWare";
import { errorLogger, errorMiddleware } from "./middleware/error.middleware";
import userRouter from "./routers/user.router";
import productRouter from "./routers/product.router";
import orderItemRouter from "./routers/orderItem.router";
import orderRouter from "./routers/order.router";
import googleRouter from "./routers/google.router";

const app = express();
app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orderItems", orderItemRouter);
app.use("/order", orderRouter);
app.use("/auth", googleRouter);

app.use(errorLogger);
app.use(errorMiddleware);

export default app;
