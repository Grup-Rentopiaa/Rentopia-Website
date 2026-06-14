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


router.get('/agreement',                         getAgreement)           
router.get('/between',                           getAgreementBetween)    
router.get('/active/:userId',                    getActiveRentals)


router.get('/eligibility/:userId/:productId',    checkReviewEligibility)


router.get('/guarantees',                        listGuarantees)
router.get('/:rentalId/guarantee-detail',        getGuaranteeDetail)


router.post('/initiate',                         initiateRental)         
router.post('/approve',                          approveRental)          
router.post('/guarantee',                        submitGuarantee)        
router.post('/:rentalId/confirm-handover',       confirmHandover)        
router.post('/:rentalId/confirm-received',       confirmReceived)        
router.post('/:rentalId/confirm-returned',       confirmReturned)        
router.post('/:rentalId/review',                 submitReview)           

module.exports = router
