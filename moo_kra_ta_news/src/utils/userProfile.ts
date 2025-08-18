// Get first letter of each word in a name
export const getUserInitials = (fullName: string): string => {
  return fullName.charAt(0).toUpperCase();
    // .split(' ')
    // .map(name => name.charAt(0).toUpperCase())
    // .join('');
};

// Tailwind background colors array
const tailwindColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-slate-500',
  'bg-gray-500',
  'bg-neutral-500',
  'bg-stone-500'
];

// Generate random color based on name (consistent for same name)
export const getRandomBgColor = (name: string): string => {
  // Create a simple hash from the name to ensure consistency
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % tailwindColors.length;
  return tailwindColors[index];
};

// Combined function for complete user profile
export const getUserProfile = (fullName: string) => {
  return {
    initials: getUserInitials(fullName),
    bgColor: getRandomBgColor(fullName)
  };
};
