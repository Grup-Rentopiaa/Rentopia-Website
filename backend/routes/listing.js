const express = require('express')
const router  = express.Router({ mergeParams: true })
const { getAll, createListing, updateListing, deleteListing } = require('../controllers/listing')

router.get(   '/',    getAll)
router.post(  '/',    createListing)
router.put(   '/:id', updateListing)
router.delete('/:id', deleteListing)

module.exports = router