const express = require('express')
const router  = express.Router()
const { authenticate } = require('../middlewares/auth')
const { getChatStatus, getAgreement, initiateRental, approveRental, submitGuarantee, confirmHandover, confirmReceived, confirmReturned, submitReview, checkReviewEligibility, getActiveRentals, listGuarantees, getGuaranteeDetail, getAgreementBetween } = require('../controllers/rentalFlow')

// semua rental flow harus login
router.get('/agreement',                      authenticate, getAgreement)
router.get('/between',                        authenticate, getAgreementBetween)
router.get('/active/:userId',                 authenticate, getActiveRentals)
router.get('/eligibility/:userId/:productId', authenticate, checkReviewEligibility)
router.get('/guarantees',                     authenticate, listGuarantees)
router.get('/:rentalId/guarantee-detail',     authenticate, getGuaranteeDetail)
router.post('/initiate',                      authenticate, initiateRental)
router.post('/approve',                       authenticate, approveRental)
router.post('/guarantee',                     authenticate, submitGuarantee)
router.post('/:rentalId/confirm-handover',    authenticate, confirmHandover)
router.post('/:rentalId/confirm-received',    authenticate, confirmReceived)
router.post('/:rentalId/confirm-returned',    authenticate, confirmReturned)
router.post('/:rentalId/review',              authenticate, submitReview)

module.exports = router