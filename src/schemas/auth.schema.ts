import { z } from 'zod';

// Define schema
export const AuthCredentialsSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email address.' }),
  /* username: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters long' })
    .optional(), */
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  // phoneNumber: z.string().optional(),
});
