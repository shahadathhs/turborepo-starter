import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'

import { IListing } from './listing.interface'
import Listing from './listing.model'

// * Create a new listing
const createListing = async (payload: Partial<IListing>): Promise<IListing> => {
  const listing = await Listing.create(payload)

  const populatedListing = await listing.populate('landlord')
  await populatedListing.save()

  return populatedListing
}

// * Retrieve listings with optional filters (location, bedrooms, rent amount) and pagination
const getAllListings = async (
  queryOptions: {
    location?: string
    bedrooms?: number
    minRent?: number
    maxRent?: number
    page?: number
    limit?: number
  } = {},
): Promise<{ listings: IListing[]; metadata: { total: number; page: number; limit: number } }> => {
  const { location, bedrooms, minRent, maxRent, page = 1, limit = 10 } = queryOptions

  // * Build filter object dynamically based on provided query options
  const filter: {
    location?: { $regex: string; $options: string }
    bedrooms?: number | { $gte: number }
    rentAmount?: { $gte?: number; $lte?: number }
  } = {}

  // * Filter by location using case-insensitive regex
  if (location) {
    filter.location = { $regex: location, $options: 'i' }
  }

  // * Apply bedrooms filter:
  // - If bedrooms is 1,2,3 use an exact match.
  // - If bedrooms is 4, use $gte.
  if (bedrooms !== undefined) {
    if (bedrooms < 4) {
      filter.bedrooms = bedrooms
    } else {
      filter.bedrooms = { $gte: bedrooms }
    }
  }

  // * Filter by rent amount within a range
  if (minRent !== undefined || maxRent !== undefined) {
    filter.rentAmount = {}
    if (minRent !== undefined) {
      filter.rentAmount.$gte = minRent
    }
    if (maxRent !== undefined) {
      filter.rentAmount.$lte = maxRent
    }
  }

  // * Calculate how many documents to skip
  const skip = (page - 1) * limit

  // * Fetch the listings with pagination
  const listings = await Listing.find(filter).skip(skip).limit(limit)
  const populatedListings = await Listing.populate(listings, { path: 'landlord' })

  // * Get the total count of listings matching the filter
  const total = await Listing.countDocuments(filter)

  return {
    listings: populatedListings,
    metadata: {
      total,
      page,
      limit,
    },
  }
}

const getAllListingsForLandlord = async (
  landlordId: string,
  queryOptions: {
    location?: string
    bedrooms?: number
    minRent?: number
    maxRent?: number
    page?: number
    limit?: number
  } = {},
): Promise<{ listings: IListing[]; metadata: { total: number; page: number; limit: number } }> => {
  const { location, bedrooms, minRent, maxRent, page = 1, limit = 10 } = queryOptions

  // * Build filter object dynamically based on provided query options
  const filter: {
    landlord?: string
    location?: { $regex: string; $options: string }
    bedrooms?: number | { $gte: number }
    rentAmount?: { $gte?: number; $lte?: number }
  } = {}

  filter.landlord = landlordId

  // * Filter by location using case-insensitive regex
  if (location) {
    filter.location = { $regex: location, $options: 'i' }
  }

  // * Apply bedrooms filter:
  // - If bedrooms is 1,2,3 use an exact match.
  // - If bedrooms is 4, use $gte.
  if (bedrooms !== undefined) {
    if (bedrooms < 4) {
      filter.bedrooms = bedrooms
    } else {
      filter.bedrooms = { $gte: bedrooms }
    }
  }

  // * Filter by rent amount within a range
  if (minRent !== undefined || maxRent !== undefined) {
    filter.rentAmount = {}
    if (minRent !== undefined) {
      filter.rentAmount.$gte = minRent
    }
    if (maxRent !== undefined) {
      filter.rentAmount.$lte = maxRent
    }
  }

  // * Calculate how many documents to skip
  const skip = (page - 1) * limit

  // * Fetch the listings with pagination
  const listings = await Listing.find(filter).skip(skip).limit(limit)

  // * Get the total count of listings matching the filter
  const total = await Listing.countDocuments(filter)

  return {
    listings,
    metadata: {
      total,
      page,
      limit,
    },
  }
}

// * Get single listing details by ID
const getListingById = async (id: string): Promise<IListing> => {
  const listing = await Listing.findById(id)
  if (!listing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return listing
}

// * Update listing (only landlord who created it should update)
const updateListing = async (
  id: string,
  payload: Partial<IListing>,
  userId: string,
): Promise<IListing> => {
  // * Check if the listing exists
  const existingListing = await Listing.findById(id)
  if (!existingListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }

  // * Check if the landlord is the owner of the listing
  if (existingListing.landlord.toString() !== userId) {
    console.warn('Unauthorized access attempt')
    // throw new AppError(httpStatusCode.FORBIDDEN, 'You are not authorized to update this listing')
  }

  // * Update the listing
  const updatedListing = await Listing.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return updatedListing
}

// * Delete listing (only landlord who created it should delete)
const deleteListing = async (id: string, userId: string): Promise<IListing> => {
  // * Check if the listing exists
  const existingListing = await Listing.findById(id)
  if (!existingListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  // // * Check if the landlord is the owner of the listing
  if (existingListing.landlord.toString() !== userId) {
    console.warn('Unauthorized access attempt')
    // throw new AppError(httpStatusCode.FORBIDDEN, 'You are not authorized to delete this listing')
  }

  // * Delete the listing
  const deletedListing = await Listing.findByIdAndDelete(id)
  if (!deletedListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return deletedListing
}

export const ListingService = {
  createListing,
  getAllListings,
  getAllListingsForLandlord,
  getListingById,
  updateListing,
  deleteListing,
}
