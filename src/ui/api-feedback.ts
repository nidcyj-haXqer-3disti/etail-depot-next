/** Keep infrastructure details and provider responses out of customer errors. */
export function requestFailure(status: number, fallback: string): string {
  if (status === 401) return "Your session has expired or your sign-in details could not be verified. Please sign in again.";
  if (status === 403) return "You don’t have access to this action. Return to your services or ask the person who manages your access.";
  if (status === 404) return "This item is no longer available. Return to your services to continue.";
  if (status === 429) return "There have been too many attempts. Please wait a moment before trying again.";
  if (status === 503) return "This service is not available yet. Please try again once setup is complete.";
  return fallback;
}
