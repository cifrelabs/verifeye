import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

/**
 * Get all contents from the database to display on the website
 * @async
 * @method
 * @returns {Promise<Array>} Array of all contents
 * @throws {Error} Supabase Error
 */
export const getContents = async () => {
	const { data, error } = await supabase
		.from('contents')
		.select()
		.not('media', 'is', null);

	if (error) {
		throw new Error(`Supabase Error`, error);
	}

	return data;
}