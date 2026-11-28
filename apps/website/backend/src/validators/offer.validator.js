import { z } from "zod";

export const getOffersSchema = z.object({
  query: z
    .object({
      type: z.enum(["BANK", "WALLET", "UPI"]).optional(),
    })
    .passthrough(),
});
