/**
 * Safely converts any error value to a renderable string.
 * Prevents the "Objects are not valid as a React child" crash
 * when an Error object reaches JSX instead of a string.
 *
 * Usage:
 *   {error && <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>}
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred. Please try again.";
};