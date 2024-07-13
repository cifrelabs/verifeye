import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_API_KEY);

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
		.not('media', 'is', null)
		.neq('media', '');

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
	const { data, error } = await supabase
		.from('highlights')
		.select()
		.eq('id', id)
		.maybeSingle();

	if (error) {
		console.error(`Supabase Error`, error);
		return null;
	}

	return data;
}