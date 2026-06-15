const express = require('express')
const router  = express.Router({ mergeParams: true })
const { authenticate } = require('../middlewares/auth')
const { getAll, createListing, updateListing, deleteListing } = require('../controllers/listing')

router.get(   '/',    getAll)                              
router.post(  '/',    authenticate, createListing)         
router.put(   '/:id', authenticate, updateListing)        
router.delete('/:id', authenticate, deleteListing)         

module.exports = router