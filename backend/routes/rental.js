const express = require('express')
const router  = express.Router({ mergeParams: true })
const { authenticate } = require('../middlewares/auth')
const { getAll, createRental, updateRental, deleteRental } = require('../controllers/rental')

router.get(   '/',    authenticate, getAll)                
router.post(  '/',    authenticate, createRental)          
router.put(   '/:id', authenticate, updateRental)        
router.delete('/:id', authenticate, deleteRental)          

module.exports = router