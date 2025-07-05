import express from "express";
import {
	createNewTransaction,
	deleteTransactionById,
	getTransactionsByUserId,
	getTransactionsSummary,
} from "../controller/transactionsController.js";

const router = express.Router();

// retrieves user's info
router.get("/:userId", getTransactionsByUserId);

// creates a new transaction
router.post("/", createNewTransaction);

// deletes a data based on transaction id (not userId)
router.delete("/:id", deleteTransactionById);

// retrieve summary of balance, income & expenditure
router.get("/summary/:userId", getTransactionsSummary);

export default router;
