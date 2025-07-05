import express from "express";
import dotenv, { configDotenv } from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // to parse into json from bit streams
app.use(rateLimiter); // check times user requested & limits accordingly

const PORT = process.env.PORT || 5001;

// @TODO: Can add a healthcheck route on API

const initDB = async () => {
	try {
		await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

		console.log("Database initialized successfully.");
	} catch (error) {
		console.log("Error initializing database:", error);
		process.exit(1);
	}
};

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
