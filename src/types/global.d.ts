import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../util/constants";

declare global {
    interface iApiResponse<T> {
        success: boolean;
        message: string;
        data?: T;
    }

    type ControllerFunction = (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
}
