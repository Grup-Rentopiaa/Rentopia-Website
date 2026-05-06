'use strict'
const { Router }         = require('express')
const { userController } = require('../controllers/user.controller')

const router = Router()

router.get('/:id',  userController.getOne)
router.post('/',    userController.create)
router.put('/:id',  userController.update)

module.exports = router