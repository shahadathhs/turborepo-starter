import Authentication from 'app/middlewares/authentication'
import validateRequest from 'app/middlewares/validateRequest'
import { UserRole } from 'app/utils/enum/userRole'
import { Router } from 'express'

import { ListingController } from './listing.controller'
import { ListingValidation } from './listing.validation'

const router = Router()

// * Create listing (Landlord only)
router.post(
  '/',
  Authentication(UserRole.LANDLORD),
  validateRequest(ListingValidation.createListingSchema),
  ListingController.createListing,
)

// * Get all listings (Public)
router.get('/', ListingController.getAllListings)

// * Get all listings for a landlord (Landlord only)
router.get(
  '/landlord',
  Authentication(UserRole.LANDLORD),
  ListingController.getAllListingsForLandlord,
)

// * Get listing details (Public)
router.get('/:id', ListingController.getListingById)

// * Update listing (Landlord only)
router.patch(
  '/:id',
  Authentication(UserRole.LANDLORD, UserRole.ADMIN),
  validateRequest(ListingValidation.updateListingSchema),
  ListingController.updateListing,
)

// * Delete listing (Landlord only)
router.delete(
  '/:id',
  Authentication(UserRole.ADMIN, UserRole.LANDLORD),
  ListingController.deleteListing,
)

export const ListingRoutes = router
