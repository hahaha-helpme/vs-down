const express = require('express')
const router = express.Router()

const homepageController = require('../views/0-views/homepage/pug.config.js')

const mongoose = require('mongoose')


router.get('/', async function (req, res, next) {
  try {
    // const result = await new Homepage({}).save()
    res.render('homepage', homepageController)
    res.send({ some: 'json' })
  } catch (err) {
    console.error(err)
  }
})

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('homepage',homepageController);
// });

module.exports = router
