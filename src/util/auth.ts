import { hash, Options } from "argon2";

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
