const express = require('express')
const router  = express.Router({ mergeParams: true })
const { getAll, createRental, updateRental, deleteRental } = require('../controllers/rental')

router.get(   '/',    getAll)
router.post(  '/',    createRental)
router.put(   '/:id', updateRental)
router.delete('/:id', deleteRental)

module.exports = router