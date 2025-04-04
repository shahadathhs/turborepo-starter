import mongoose, { Document } from 'mongoose'

// * Interface for Listing
export interface IListing extends Document {
  location: string
  description: string
  rentAmount: number
  bedrooms: number
  images?: string[]
  amenities?: string[]
  landlord: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
