const express = require('express')
const router = express.Router()

const createError = require('http-errors')

const Homepage = require('../models/homepage')

const homepageController = require('../views/0-views/homepage/pug.config.js')

router.get('/', async (req, res, next)=> {
  try{

    let page = await Homepage.getViewLocals(res)
    if (!page) {next(createError(404, 'We can not find this page.'))}
    
    res.json(page)
    // ** datalayer **

    // ** doctype ** 
    page.viewLocals.doctype.language = page.getHeadLanguage

    // ** head **
    const pageHead = page.viewLocals.head
    pageHead.canonical = page.getHeadCanonical(req)
    pageHead.relAlternate = await Service.getHeadRelAlternate(req, res)

    // ** nav **
    const pageNav = page.viewLocals.body.nav
    pageNav.links.logo = page.getNavlogoLink(req, res)
    pageNav.links.header = page.getNavHeaderLink(req, res)
    pageNav.images.logo = page.getNavLogoImg
    pageNav.images.flag = page.getNavCountryFlagImg
    pageNav.alt.flag = page.getNavCountryFlagAlt

    // ** header **
    const pageHeader = page.viewLocals.body.header
    pageHeader.text.header = page.getHeaderTitle

    // ** faq **
    // hier missen functies die content ophalen

    // ** about **
    const pageAbout = page.viewLocals.body.about
    pageAbout.links.breadcrumb = page.getAboutBreadcrumb(req, res)

    // ** serviceDownGrid **

    // ** modal **
    const pageModal = page.viewLocals.body.modal
    pageModal.geolocation.flags = await Service.getModalGeolocationFlags(req, res)
    pageModal.positionPushing.flags = await Service.getModalPositionPushingFlags(req, res)
    pageModal.countryAlternative.flags = await Service.getModalCountryAlternativeFlags(req, res)


    //res.json(page)
    //res.json(servicesController.locals)
    //res.render('homepage', page);
    //res.render('homepage',homepageController.locals);
  } catch (err){
     console.error(err)
  }
  
});

module.exports = router
