
/**
 * Generates a unique user ID with alphanumeric characters
 * Length of 8 characters (within the 5-10 range specified)
 */
export function generateUserId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8; // Choose a length between 5-10 as specified
  let result = '';
  
  // Create a Uint8Array with as many elements as characters we need
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  
  // Use the random values to select characters from our set
  for (let i = 0; i < length; i++) {
    // Use modulo to ensure the value is within the range of our characters array
    result += characters.charAt(randomValues[i] % characters.length);
  }
  
  return result;
}

/**
 * Validates that a user ID follows the required pattern
 * - 5-10 alphanumeric characters
 */
export function validateUserId(userId: string): boolean {
  const regex = /^[a-zA-Z0-9]{5,10}$/;
  return regex.test(userId);
}
