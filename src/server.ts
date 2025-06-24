import "dotenv/config";
import express, { Express } from "express";
import errorHandler from "./middlewares/error.middleware";
import userRouter from "./routes/v1/user.route";
import cors from "cors";
const PORT = process.env.PORT;

const app: Express = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    }),
);

app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use(errorHandler);

app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error("[error]:", error?.message);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
