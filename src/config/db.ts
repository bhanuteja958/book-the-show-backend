import { Pool } from "pg";

const connectionURL: string | undefined = process.env.DATABASE_URL;

if (!connectionURL) {
    console.error(
        "Database connection string is missing. Exiting the application",
    );
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionURL,
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

export default pool;
