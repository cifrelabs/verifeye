import { createClient } from "@supabase/supabase-js";

/**
 * Get all contents from the database to display on the website
 * @async
 * @method
 * @returns {Promise<Array>} Array of all contents
 * @throws {Error} Supabase Error
 */
export const getContents = async () => {
	// Create a single supabase client for interacting with your database
	const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

	const { data, error } = await supabase
		.from('contents')
		.select()
		.neq('media', "")
		.not('media', 'is', null);

	if (error) {
		throw new Error(`Supabase Error`, error);
	}

	return data;
}

/**
 * Get a single Highlight from the database to display on the website
 * @async
 * @method
 * @param {string} id - The id of the highlight
 * @returns {Promise<object>} the highlight object
 * @throws {Error} Supabase Error
 */
export const getHighlight = async (id) => {
	// Create a single supabase client for interacting with your database
	const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

	const { data, error } = await supabase
		.from('highlights')
		.select()
		.eq('id', id)
		.limit(1)
		.maybeSingle();

	if (error) {
		console.error(`Supabase Error`, error);
		return null;
	}

	return data;
}