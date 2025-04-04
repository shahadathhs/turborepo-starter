import { asyncHandler } from 'app/utils/asyncHandler'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import sendResponse from 'app/utils/sendResponse'
import { NextFunction, Request, Response } from 'express'

import { ListingService } from './listing.service'

// * Create a new listing (Landlord only)
const createListing = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  const payload = { ...req.body, landlord: user.userId }
  const result = await ListingService.createListing(payload)
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Listing created successfully.',
    data: result,
  })
  next()
}

// * Get all listings (Public)
const getAllListings = async (req: Request, res: Response, next: NextFunction) => {
  const filters = req.query
  const result = await ListingService.getAllListings(filters)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Listings retrieved successfully.',
    data: result,
  })
  next()
}

// * Get all listings for a landlord (Landlord only)
const getAllListingsForLandlord = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user
  const filters = req.query
  const result = await ListingService.getAllListingsForLandlord(userId, filters)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Listings retrieved successfully.',
    data: result,
  })
  next()
}

// * Get listing details (Public)
const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await ListingService.getListingById(id)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Listing details retrieved successfully.',
    data: result,
  })
  next()
}

// * Update a listing (Landlord only)
const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const userId = req.user.userId
  const result = await ListingService.updateListing(id, req.body, userId)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Listing updated successfully.',
    data: result,
  })
  next()
}

// * Delete a listing (Landlord only)
const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const userId = req.user.userId
  const result = await ListingService.deleteListing(id, userId)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Listing deleted successfully.',
    data: result,
  })
  next()
}

export const ListingController = {
  createListing: asyncHandler(createListing),
  getAllListings: asyncHandler(getAllListings),
  getAllListingsForLandlord: asyncHandler(getAllListingsForLandlord),
  getListingById: asyncHandler(getListingById),
  updateListing: asyncHandler(updateListing),
  deleteListing: asyncHandler(deleteListing),
}
