export function formatCamelCase(input: string): string {
  // Remove 'Id' or 'ID' (case-insensitive) from the end of the string
  const cleaned = input.replace(/Id$/i, '');

  // Add space before capital letters and lowercase the result
  const spaced = cleaned.replace(/([A-Z])/g, ' $1').toLowerCase();

  // Capitalize the first letter
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
