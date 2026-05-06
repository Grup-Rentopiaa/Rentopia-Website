'use strict'
const { Router }            = require('express')
const { listingController } = require('../controllers/listing.controller')

const router = Router({ mergeParams: true })

router.get(  '/',    listingController.getAll) 
router.post(  '/',    listingController.create) 
router.put(  '/:id', listingController.update)  
router.delete('/:id', listingController.delete)

module.exports = router