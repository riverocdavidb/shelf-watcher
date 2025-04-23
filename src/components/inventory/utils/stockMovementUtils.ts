
// Utility functions for stock movement

// Get appropriate color class for different movement types
export const getMovementColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "received":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "sold":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "damaged":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "stolen":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "adjustment":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Format date string to local date string
export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (err) {
    return dateString;
  }
};

// Movement types for dropdown
export const movementTypes = [
  { value: "received", label: "Received" },
  { value: "sold", label: "Sold" },
  { value: "damaged", label: "Damaged" },
  { value: "stolen", label: "Stolen" },
  { value: "adjustment", label: "Adjustment" },
];
