import { z } from "zod";

export const EmailSchema = z.object({
  email: z.email(),
});
export type EmailSchemaType = z.infer<typeof EmailSchema>;
