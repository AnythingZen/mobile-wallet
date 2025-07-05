import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
	try {
		// @TODO: to be fixed up with user id instead of a constant identifier
		const { success } = await rateLimit.limit("rate-limit-test");

		if (!success) {
			return res.status(429).json({
				message: "Too many requests, please try again later.",
			});
		}
		next();
	} catch (error) {
		console.log("Rate Limit Error", error);
		next(error);
	}
};

export default rateLimiter;
