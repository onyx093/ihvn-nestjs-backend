import { z } from 'zod';

// Define schema
export const AuthCredentialsSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
