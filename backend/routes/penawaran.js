const express = require('express');
const router = express.Router();
const { createPenawaran } = require('../controllers/penawaran');

router.post('/', createPenawaran);

module.exports = router;
