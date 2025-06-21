import { PoolClient, QueryResult } from "pg";
import pool from "../config/db";
import { User } from "../types/user";

export const createUser: (userDetails: User) => Promise<string> = async (
    userDetails: User,
) => {
    let connection: PoolClient | null = null;
    try {
        connection = await pool.connect();
        let { fullName, email, passwordHash, dateOfBirth, mobile } =
            userDetails;
        const res: QueryResult<{ user_id: string }> = await connection.query(
            `INSERT INTO users (full_name, email, password_hash, date_of_birth, mobile) VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
            [fullName, email, passwordHash, dateOfBirth, mobile],
        );

        return res.rows[0].user_id;
    } catch (error: unknown) {
        throw error;
    } finally {
        connection?.release();
    }
};

export const checkIfUserAlreadExists: (
    email: string,
    mobile: string,
) => Promise<boolean> = async (email: string, mobile: string) => {
    let connection: PoolClient | null = null;
    try {
        connection = await pool.connect();
        let res: QueryResult<{ user_id: string }> = await connection.query(
            `SELECT user_id FROM users WHERE email=$1 OR mobile=$2`,
            [email, mobile],
        );

        if (res.rows.length > 0) {
            return true;
        }

        return false;
    } catch (error: unknown) {
        throw error;
    } finally {
        connection?.release();
    }
};
