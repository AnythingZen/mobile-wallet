import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		const userTransactions = await sql`
			SELECT * FROM transactions WHERE user_id =${userId} ORDER BY created_at DESC
		`;

		res.status(200).json(userTransactions);
	} catch (error) {
		console.log("Error creating transaction:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createNewTransaction = async (req, res) => {
	try {
		const { user_id, title, amount, category } = req.body;

		if (!user_id || !title || amount === "undefined" || !category) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;

		res.status(201).json(transaction[0]);
	} catch (error) {
		console.log("Error creating transaction:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteTransactionById = async (req, res) => {
	try {
		const { id } = req.params;

		if (isNaN(parseInt(id))) {
			return res.status(400).json({ message: "Invalid transaction ID" });
		}

		const result = await sql`
                DELETE FROM transactions WHERE id = ${id} RETURNING *
            `;

		if (result.length === 0) {
			return res.status(400).json({ message: "Transaction not found" });
		}
		return res
			.status(200)
			.json({ message: "Transaction deleted successfully" });
	} catch (error) {
		console.log("Error deleting transaction", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getTransactionsSummary = async (req, res) => {
	try {
		const { userId } = req.params;

		const balanceResult = await sql`
			SELECT COALESCE(SUM(amount), 0::numeric) as balance
			FROM transactions WHERE user_id = ${userId}
		`;

		// We define amount > 0 = income (+10 from salary)
		// amount < 0 = expenditure (-10 from grocery)
		const incomeResult = await sql`
			SELECT COALESCE(SUM(amount), 0::numeric) as income
			FROM transactions WHERE user_id = ${userId} 
			AND amount > 0
		`;

		const expensesResult = await sql`
			SELECT COALESCE(SUM(amount), 0::numeric) as expenses
			FROM transactions WHERE user_id = ${userId} 
			AND amount < 0
		`;

		res.status(201).json({
			balance: balanceResult[0].balance,
			income: incomeResult[0].income,
			expensesResult: expensesResult[0].expenses,
		});
	} catch (error) {
		console.log("Error getting transactions summary", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
