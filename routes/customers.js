const express = require('express')
const router = express.Router()

router.get('/', checkCustomerAuthenticated, (req, res) => {
  res.render('customers/index')
})


function checkCustomerAuthenticated(req, res, next) {
if (authenticateCustomer) {
 return next()
}
res.redirect('/customers/login')
}

function checkCustomerNotAuthenticated(req, res, next) {
if (!authenticateCustomer) {
 return next()
}
res.redirect('/customers/login')
}

module.exports = router
