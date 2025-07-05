import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Create a connection to the Neon database
export const sql = neon(process.env.DATABASE_URL);