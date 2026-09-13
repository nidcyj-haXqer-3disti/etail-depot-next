/** A readable transaction must still belong to the explicitly selected card. */
export function transactionBelongsToCard(activity: readonly { id: string; cardId: string | null }[], transactionId: string, cardId: string) {
  return activity.some(item => item.id.toLowerCase() === transactionId.toLowerCase() && item.cardId?.toLowerCase() === cardId.toLowerCase());
}
