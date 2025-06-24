import { PoolClient } from "pg";
import pool from "../config/db";

export const storeRefreshToken: (
    userId: string,
    tokenHash: string,
    expiresOn: string,
) => Promise<void> = async (
    userId: string,
    tokenHash: string,
    expiresOn: string,
) => {
    let connection: PoolClient | null = null;
    try {
        connection = await pool.connect();
        await connection.query("BEGIN");

        await connection.query(
            `UPDATE refresh_tokens SET is_revoked = $1,revoked_on = $2 WHERE user_id = $3 AND is_revoked = false`,
            [true, new Date().toISOString(), userId],
        );

        await connection.query(
            `INSERT INTO refresh_tokens(user_id, token_hash, expires_on) VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresOn],
        );
        await connection.query("COMMIT");
    } catch (error) {
        await connection?.query("ROLLBACK");
        throw error;
    } finally {
        connection?.release();
    }
};
