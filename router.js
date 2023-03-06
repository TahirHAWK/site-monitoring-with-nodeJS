const express = require('express')
const router = express.Router()
// controller files will be linked here
const siteMonitorController = require('./controller/siteMonitorController')

// Home routes
router.get('/', siteMonitorController.addNewSite);

// other routes will start from here




module.exports = router