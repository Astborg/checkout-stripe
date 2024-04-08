const express = require('express')
const { createCheckoutSession, products, verifySession, register } = require('./stripe.controller')
const router = express.Router()

router.post('/create-checkout-session', createCheckoutSession)
router.get('/products', products);
router.post("/verify-session", verifySession)
router.post('/register', register)

module.exports = router