import { z } from 'zod'

const createListingSchema = z.object({
  body: z.object({
    location: z.string({ required_error: 'Location is required' }),
    description: z.string({ required_error: 'Description is required' }),
    rentAmount: z.number({ required_error: 'Rent amount is required' }),
    bedrooms: z.number({ required_error: 'Number of bedrooms is required' }),
    images: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
})

const updateListingSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    description: z.string().optional(),
    rentAmount: z.number().optional(),
    bedrooms: z.number().optional(),
    images: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
})

export const ListingValidation = {
  createListingSchema,
  updateListingSchema,
}
