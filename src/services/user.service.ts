import { PoolClient, QueryResult } from "pg";
import pool from "../config/db";
import { CreatUserPayload, UserDetails } from "../types/user";

export const createUser: (
    userDetails: CreatUserPayload,
) => Promise<string> = async (userDetails: CreatUserPayload) => {
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

export const getUserDetailsByEmail: (
    email: string,
) => Promise<UserDetails | null> = async (email: string) => {
    let connection: PoolClient | null = null;
    try {
        connection = await pool.connect();
        const result: QueryResult<UserDetails> = await connection.query(
            `SELECT user_id AS "userId", email, password_hash AS "passwordHash", date_of_birth AS "dateOfBirth", full_name AS "fullName", mobile from users where email = $1`,
            [email],
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        throw error;
    }
};
