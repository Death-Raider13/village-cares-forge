import { z } from 'zod';
import { validatePasswordStrength, validateEmail } from './security';

export const signInSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .refine(validateEmail, 'Please enter a valid email address'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long')
    .refine(
      (password) => validatePasswordStrength(password).valid,
      (password) => ({
        message: validatePasswordStrength(password).errors.join(', '),
      })
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine(validateEmail, 'Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(1000, 'Message must be less than 1000 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;