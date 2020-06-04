const express = require('express')
const router = express.Router()

const json = require('../reports-seed.js')

const mongoose = require('mongoose')
const Report = require('../models/report')

router.get('/', async (req, res, next) => {
  try {
    await mongoose.connection.db.dropCollection('reports', function (err, result) {})

    const seedData = json.reports
    const readyforImport = seedData.map(seed => {
      return seed
    })

    await Report.insertMany(readyforImport)
    res.send('ok')
  } catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
