import {z} from "zod";

/** Shared Cardholder help topics; the same values validate commands and return destinations. */
export const supportTopicSchema=z.enum(["SERVICE","ACCESS","CARD","TRANSACTION"]);
