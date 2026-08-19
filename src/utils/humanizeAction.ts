/**
 * Converts Prolog-style snake_case or SCREAMING_SNAKE_CASE action names
 * into clean, readable Title Case.
 */
export function humanizeAction(action: string): string {
  if (!action) return 'Emergency Assessment Protocol';
  return action
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      // Keep well-known acronyms capitalized
      if (['cpr', 'aed', 'fast', 'co2', 'mci', 'start', 'rpm', 'noaa', 'gps', 'ct'].includes(lower)) {
        return lower.toUpperCase();
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}
