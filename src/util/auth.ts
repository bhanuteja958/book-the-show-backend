import { hash, Options, verify } from "argon2";
import jwt from "jsonwebtoken";
import { AuthTokens } from "../types/auth";

export const hashPassword: (password: string) => Promise<string> = async (
    password: string,
) => {
    try {
        const secret: string | undefined = process.env.HASH_SECRET;
        if (!secret) {
            throw new Error("Hash secret missing from environment variables");
        }

        const hashOptions: Options = {
            secret: Buffer.from(secret),
            memoryCost: 2 ** 16,
            timeCost: 4,
            parallelism: 1,
        };

        const hashedPassword = await hash(password, hashOptions);

        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

export const checkPasswordMatch: (
    inputPassword: string,
    storedPasswordHash: string,
) => Promise<boolean> = async (
    inputPassword: string,
    storedPasswordHash: string,
) => {
    try {
        const secret: string | undefined = process.env.HASH_SECRET;
        if (!secret) {
            throw new Error("Hash secret missing from environment variables");
        }
        const isMatching = await verify(storedPasswordHash, inputPassword, {
            secret: Buffer.from(secret),
        });
        return isMatching;
    } catch (error) {
        throw error;
    }
};

export const generateAuthTokens: (userId: string) => AuthTokens = (
    userId: string,
) => {
    try {
        const accessTokenSecret: string | undefined =
            process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret: string | undefined =
            process.env.REFRESH_TOKEN_SECRET;

        if (!accessTokenSecret || !refreshTokenSecret) {
            throw new Error(
                "Token signing secrets missing from environment variables",
            );
        }
        const accessToken = jwt.sign({ userId }, accessTokenSecret, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
            expiresIn: "7d",
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw error;
    }
};
