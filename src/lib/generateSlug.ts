import Problem from "@/models/Problem.model";

// Function to convert a title into a slug without lodash
function toSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, "") // Remove special characters
		.trim() // Remove leading/trailing spaces
		.replace(/\s+/g, "-"); // Replace spaces with hyphens
}

// Generates a unique slug by checking existing records
export async function generateUniqueSlug(title: string): Promise<string> {
	const baseSlug = toSlug(title);
	let slug = baseSlug;
	let count = 1;

	// Ensure uniqueness
	while (await Problem.findOne({ slug })) {
		slug = `${baseSlug}-${count++}`;
	}

	return slug;
}
