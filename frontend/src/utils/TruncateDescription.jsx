export const truncateDescription = (description) => {
  // Ensure description is not null or undefined
  const words = description?.split(" ") || [];

  // Check if the number of words is greater than the maximum allowed
  return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : description;
};
