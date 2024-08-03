import { z } from "zod";

const userSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(30, "Username must be less than 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default userSchema;
