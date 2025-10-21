import { z } from "zod";

export const UploadSchema = z.object({
  file: z.file("You must select a valid photo"),
  entryId: z.string().min(1, "You must select a habit"),
  caption: z.optional(z.string()),
});
export type UploadSchemaType = z.infer<typeof UploadSchema>;
