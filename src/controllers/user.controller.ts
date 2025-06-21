import { NextFunction, Request, Response } from "express";
import {
    RegistrationPayload,
    RegistrationPayloadSchema,
    ValidatedRegistrationPayload,
} from "../validators/user.validator";
import { HttpStatusCodes } from "../util/constants";
import { hashPassword } from "../util/auth";
import { checkIfUserAlreadExists, createUser } from "../services/user.service";

export const registerUser: ControllerFunction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const body: RegistrationPayload = req.body;
        const validationResult: ValidatedRegistrationPayload =
            await RegistrationPayloadSchema.safeParseAsync(body);

        if (!validationResult.success) {
            res.status(HttpStatusCodes.badRequest).json({
                success: false,
                message: "Invalid registration payload",
                data: {},
            });
            return;
        }

        const userAlreadyExists = await checkIfUserAlreadExists(
            validationResult.data.email,
            validationResult.data.mobile,
        );

        if (userAlreadyExists) {
            res.status(HttpStatusCodes.badRequest).json({
                success: false,
                message: "User with the given email/mobile already exists",
                data: {},
            });
            return;
        }

        const passwordHash: string = await hashPassword(
            validationResult.data.password,
        );

        const userDetails = {
            fullName: validationResult.data.fullName,
            dateOfBirth: validationResult.data.dateOfBirth,
            mobile: validationResult.data.mobile,
            email: validationResult.data.email,
            passwordHash,
        };

        const userId = await createUser(userDetails);

        if (!userId) {
            res.status(HttpStatusCodes.badRequest).json({
                success: false,
                message: "Something went wrong when registering user",
                data: {},
            });
            return;
        }

        res.status(HttpStatusCodes.created).json({
            success: false,
            message: "Successfully Registered User",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
