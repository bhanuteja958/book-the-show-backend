import { NextFunction, Request, Response } from "express";
import {
    LoginPayload,
    LoginPayloadSchema,
    RegistrationPayload,
    RegistrationPayloadSchema,
    ValidatedLoginPayload,
    ValidatedRegistrationPayload,
} from "../validators/user.validator";
import { HttpStatusCodes } from "../util/constants";
import {
    checkPasswordMatch,
    generateAuthTokens,
    hashPassword,
} from "../util/auth";
import {
    checkIfUserAlreadExists,
    createUser,
    getUserDetailsByEmail,
} from "../services/user.service";
import { CreatUserPayload, UserDetails } from "../types/user";
import { AuthTokens } from "../types/auth";
import { createHash } from "crypto";
import { storeRefreshToken } from "../services/auth.service";

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

        const userDetails: CreatUserPayload = {
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

export const loginUser: ControllerFunction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload: LoginPayload = req.body;

        const validationResult: ValidatedLoginPayload =
            await LoginPayloadSchema.safeParseAsync(payload);

        if (!validationResult.success) {
            res.status(HttpStatusCodes.badRequest).json({
                success: false,
                message: "Invalid login payload",
                data: {},
            });
            return;
        }

        const { email, password } = validationResult.data;

        const userDetails: UserDetails | null =
            await getUserDetailsByEmail(email);

        if (!userDetails) {
            res.status(HttpStatusCodes.notFound).json({
                success: false,
                message: "Invalid email/password",
                data: {},
            });
            return;
        }
        const isMatchingStoredPassword = await checkPasswordMatch(
            password,
            userDetails.passwordHash,
        );

        if (!isMatchingStoredPassword) {
            res.status(HttpStatusCodes.notFound).json({
                success: false,
                message: "Invalid email/password",
                data: {},
            });
            return;
        }

        const tokens: AuthTokens = generateAuthTokens(userDetails.userId);

        const refreshTokenHash = createHash("sha256")
            .update(tokens.refreshToken)
            .digest("base64");
        const refreshTokenExpiresOn = new Date(
            new Date().getTime() + 1 * 24 * 60 * 60 * 1000,
        );

        await storeRefreshToken(
            userDetails.userId,
            refreshTokenHash,
            refreshTokenExpiresOn.toISOString(),
        );

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 1 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        res.status(HttpStatusCodes.ok).json({
            success: true,
            message: "Successfully logged in",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
