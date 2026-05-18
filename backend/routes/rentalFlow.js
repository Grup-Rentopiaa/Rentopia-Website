const express = require('express')
const router  = express.Router()
const {
  getChatStatus, getAgreement,
  initiateRental,
  approveRental, submitGuarantee,
  confirmHandover, confirmReceived, confirmReturned,
  submitReview, checkReviewEligibility,
  getActiveRentals, listGuarantees, getGuaranteeDetail,
  getAgreementBetween,
} = require('../controllers/rentalFlow')

// Agreement lookup & active rentals
router.get('/agreement',                         getAgreement)           // ?buyerId=&sellerId=&itemId=
router.get('/between',                           getAgreementBetween)    // ?userId=&otherId= (seller-side lookup)
router.get('/active/:userId',                    getActiveRentals)

// Review eligibility
router.get('/eligibility/:userId/:productId',    checkReviewEligibility)

// Admin
router.get('/guarantees',                        listGuarantees)
router.get('/:rentalId/guarantee-detail',        getGuaranteeDetail)

// Rental lifecycle state transitions
router.post('/initiate',                         initiateRental)         // -1→0: creates pending agreement + WS push to seller
router.post('/approve',                          approveRental)          // 0→1
router.post('/guarantee',                        submitGuarantee)        // 1→2
router.post('/:rentalId/confirm-handover',       confirmHandover)        // 2→3
router.post('/:rentalId/confirm-received',       confirmReceived)        // 3→4
router.post('/:rentalId/confirm-returned',       confirmReturned)        // 4→5
router.post('/:rentalId/review',                 submitReview)           // review at state 5

module.exports = router
