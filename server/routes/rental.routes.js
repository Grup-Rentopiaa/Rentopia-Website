'use strict'
const { Router }            = require('express')
const { rentalController } = require('../controllers/rental.controller')

const router = Router({ mergeParams: true })

router.get(  '/',    rentalController.getAll) 
router.post(  '/',    rentalController.create) 
router.put(  '/:id', rentalController.update)  
router.delete('/:id', rentalController.delete)

module.exports = router