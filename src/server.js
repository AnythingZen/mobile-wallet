import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
if (process.env.NODE_ENV === "production") job.start();

// Middleware
app.use(express.json()); // to parse into json from bit streams
app.use(rateLimiter); // check times user requested & limits accordingly

const PORT = process.env.PORT || 5001;

// healthcheck route on API
app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
