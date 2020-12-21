const express = require('express')
const router = express.Router()
const { ensureGuest } = require('../middleware/checkauth')
const basic = require('../controllers/basic')

router.get(['/', '/home'], basic.getHome)

module.exports = router