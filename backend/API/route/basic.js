const express = require('express')
const router = express.Router()
const { ensureGuest } = require('../middleware/checkauth')
const basic = require('../controllers/basic')

router.get(['/', '/home'], ensureGuest, basic.getHome)

module.exports = router