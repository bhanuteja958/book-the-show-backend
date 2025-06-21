import { Router } from "express";
import { registerUser } from "../../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/register", registerUser);

export default userRouter;
