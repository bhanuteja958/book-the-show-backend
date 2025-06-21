import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
import { HttpStatusCodes } from "../util/constants";

const errorHandler: (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => void = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const path = req.path;
    if (error instanceof Error) {
        logger.error({
            title: `Error while executing api "${path}": ${error.message}`,
            stack: error.stack,
            data: req.body || {},
        });
    } else {
        logger.error({
            title: `Error while executing function "${path}": Something went wrong`,
            data: req.body || {},
        });
    }

    res.status(HttpStatusCodes.internalServerError).json({
        success: false,
        message: "Something went wrong",
        data: {},
    });

    next();
};

export default errorHandler;
