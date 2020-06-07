const express = require('express')
const router = express.Router()

const servicesController = require('../views/0-views/service/pug.config.js')

const createError = require('http-errors')

const mongoose = require('mongoose')
const Service = require('../models/service')
const Report = require('../models/report')

/* GET service page. */
router.get('/', async (req, res, next) => {
  try {
    const page = await Service.getViewLocals(res)
    if (!page) {next(createError(404, 'We can not find this page.'))}

    page.viewLocals.doctype.language = page.getHeadLanguage

    const pageHead = page.viewLocals.head
    pageHead.relAlternate = await Service.getHeadRelAlternate(req, res)
    pageHead.canonical = page.getHeadCanonical(req)

    const pageNav = page.viewLocals.body.nav
    pageNav.links.logo = page.getNavlogoLink(req, res)
    pageNav.links.header = page.getNavHeaderLink(req, res)
    pageNav.images.logo = page.getNavLogoImg
    pageNav.images.flag = page.getNavCountryFlagImg
    pageNav.alt.flag = page.getNavCountryFlagAlt

    // drie of meer voor paragraaf met dynamische gegevens voor company detail //combinatie van (static + cron + unieke tekst)

    const pageServiceDetails = page.viewLocals.body.serviceDetails
    pageServiceDetails.images.service = page.getServiceDetailsLogoImg
    pageServiceDetails.alt.service = page.getServiceDetailsLogoAlt

    // zes of meer voor paragraaf met dynamische gegevens voor accordion answers //combinatie van (static + cron + unieke tekst)
    const pageAbout = page.viewLocals.body.about
    pageAbout.links.breadcrumb = page.getAboutBreadcrumb(req, res)

    const pageModal = page.viewLocals.body.modal
    pageModal.geolocation.flags = await Service.getModalGeolocationFlags(req, res)
    pageModal.positionPushing.flags = await Service.getModalPositionPushingFlags(req, res)
    pageModal.countryAlternative.flags = await Service.getModalCountryAlternativeFlags(req, res)

    const pageDatalayer = page.viewLocals.body.datalayer
    
    let reportsCountsArr = await Report.getDatalayerServiceStatus(res)
    reportsCountsArr =[];
    // finding upper control limit for c chart

    if(reportsCountsArr.length !== 0){
      let summedTotalCount = 0;
      let numberOfReports = reportsCountsArr.length;

      reportsCountsArr.forEach(obj => {
        summedTotalCount += obj.count;
      })
      
      const centerline = summedTotalCount/numberOfReports;
      const upperControlLimit = centerline + 3 * Math.sqrt(centerline);
      const latestCountOfreports = reportsCountsArr[0].count

      // setting datalayer service status
      if(upperControlLimit > latestCountOfreports){
        pageDatalayer.service.status = 0
      } else {
        pageDatalayer.service.status = 1
      }
    } else {
        pageDatalayer.service.status = 0
    }
    
    pageDatalayer.serviceView.downChart.timeReportsSequence = await Report.getDatalayerNumberOfReports(res); 
    
  
    const pageHeader = page.viewLocals.body.header
    pageHeader.text.header = page.getHeaderTitle
    
    // console.log(page.viewLocals.body.about)
    // console.log('---------------------------------------------------------------------')
    // console.log(servicesController.locals.viewLocals.body.about)

    //res.json(page)
    //res.json(servicesController.locals)
    res.render('service', page);
    //res.render('service', servicesController.locals); // all je alles wilt zien gebruik dan servicesController
  } catch (err) {
    console.error(err)
  }
})

router.post('/report-problem', async (req, res, next) => {
  const {
    type,
    languageCode,
    countryCode,
    nameHyphen,
    cityName,
    description
  } = req.body

   await new Report({
    type,
    languageCode,
    countryCode,
    nameHyphen,
    cityName,
    description
    }).save()

  res.status(200).end()
})

router.post('/report-problem-description', async (req, res, next) => {
  res.status(200).end()
})

module.exports = router
