const express = require('express')
const router = express.Router()
const error = require('../controllers/error');

router.get('/401', error.error401)

module.exports = router