import mongoose, { Schema, Model } from 'mongoose'

import { IListing } from './listing.interface'

const ListingSchema: Schema<IListing> = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
    },
    images: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord reference is required'],
    },
  },
  {
    timestamps: true, // * Automatically adds createdAt and updatedAt
  },
)

const Listing: Model<IListing> = mongoose.model<IListing>('Listing', ListingSchema)
export default Listing
