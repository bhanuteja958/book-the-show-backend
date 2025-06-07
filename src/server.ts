import "dotenv/config";
import express, { Express } from "express";
const PORT = process.env.PORT;

const app: Express = express();

app.listen(PORT, (error?: Error) => {
    if (error) {
        console.error("[error]:", error?.message);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
