
// Predefined colors for tags
export const TAG_COLORS = {
  default: "bg-secondary",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
} as const;

export type TagColor = keyof typeof TAG_COLORS;

// Function to get a consistent color for a tag based on its name
export const getTagColor = (tagName: string): TagColor => {
  const colors = Object.keys(TAG_COLORS) as TagColor[];
  const index = Math.abs(
    tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % (colors.length - 1) + 1; // Skip 'default'
  return colors[index];
};

export const getTagColorClass = (color: TagColor): string => {
  return TAG_COLORS[color];
};
