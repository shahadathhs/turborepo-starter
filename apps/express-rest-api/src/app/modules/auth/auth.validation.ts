import { z } from 'zod'

const registerUserZodSchema = z.object({
  body: z.object({
    // * Name must be at least 5 characters
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, { message: 'Name must be at least 5 characters' }),
    // * Must be a valid email address
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    // * Phone number is required (you can adjust the min length as needed)
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(10, { message: 'Phone number must be at least 10 characters' }),
    // * Password must be between 6 and 20 characters
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must be at most 20 characters' }),
    // * Role must be either 'landlord' or 'tenant'
    role: z.enum(['landlord', 'tenant'], { required_error: 'Role is required' }),
  }),
})

const updateProfileZodSchema = z.object({
  body: z.object({
    // * Name must be at least 5 characters
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, { message: 'Name must be at least 5 characters' }),
    // * Must be a valid email address
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    // * Phone number is required for profile update as well
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(10, { message: 'Phone number must be at least 10 characters' }),
  }),
})

export const AuthValidation = {
  registerUserZodSchema,
  updateProfileZodSchema,
}
