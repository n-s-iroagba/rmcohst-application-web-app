export function formatCamelCase(input: string): string {
  
  const spaced = input.replace(/([A-Z])/g, " $1").toLowerCase();
  
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
