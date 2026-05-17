const express = require('express')
const router  = express.Router()
const {
  getChatStatus, getAgreement,
  approveRental, submitGuarantee,
  confirmHandover, confirmReceived, confirmReturned,
  submitReview, checkReviewEligibility,
  getActiveRentals,
} = require('../controllers/rentalFlow')

// Agreement lookup
router.get('/agreement',                         getAgreement)           // ?buyerId=&sellerId=&itemId=
router.get('/active/:userId',                    getActiveRentals)

// Review eligibility
router.get('/eligibility/:userId/:productId',    checkReviewEligibility)

// Rental lifecycle state transitions
router.post('/approve',                          approveRental)          // 0→1
router.post('/guarantee',                        submitGuarantee)        // 1→2
router.post('/:rentalId/confirm-handover',       confirmHandover)        // 2→3
router.post('/:rentalId/confirm-received',       confirmReceived)        // 3→4
router.post('/:rentalId/confirm-returned',       confirmReturned)        // 4→5
router.post('/:rentalId/review',                 submitReview)           // review at state 5

module.exports = router
