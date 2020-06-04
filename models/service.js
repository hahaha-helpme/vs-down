const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  viewLocals: {
    doctype: {
      language: String
    },

    head: {
      canonical: String,
      title: String,
      description: String,
      relAlternate: Array
    },

    body: {

      nav: {
        links: {
          logo: String,
          header: String
        },
        images: {
          logo: String,
          flag: String
        },
        text: {
          header: String
        },
        alt: {
          logo: String,
          flag: String
        }
      },

      header: {
        text: {
          header: String,
        }
      },

      downChart: {
        text: {
          header: String
        }
      },

      reportProblem: {
        text: {
          header: String,
          button: String
        }

      },

      serviceDetails: {
        text: {
          header: String,
          paragraph: {
            purpose: String,
            contact: String,
            cool: String,
            whateva: String
          }
        },
        images: {
          service: String
        },
        alt: {
          service: String
        }
      },

      faq: {
        text: {
          header: String,

          accordion: [{
            question: String,
            answer: {
              1: String,
              2: String
            }
          }, {
            question: String,
            answer: {
              1: String,
              2: String
            }
          }, {
            question: String,
            answer: {
              1: String,
              2: String
            }
          }]
        }
      },

      about: {
        text: {
          header: String,
          paragraph: {
            1: String,
            2: String,
            3: String,
            4: String,
            5: String
          }
        },
        links: {
          breadcrumb: Array
        }
      },

      modal: {
        about: {
          text: {
            header: String,
            paragraph: {
              1: String,
              2: String
            }
          },
          images: {
            logo: String
          },
          alt: {
            logo: String
          }

        },
          reportProblem: {
            text: {
              header: String,
              paragraph: {
                1: String,
                2: String,
              },
              button: String,
            }

          },

        geolocation: {
          text: {
            header: String,
            paragraph: {
              1: String,
              2: String
            }
          },
          flags: Array
        },

        positionPushing: {
          text: {
            header: String,
            paragraph: {
              1: String,
              2: String
            }
          },
          flags: Array
        },

        countryAlternative: {
          text: {
            header: String,
            paragraph: {
              1: String,
              2: String
            }
          },
          flags: Array
        }

      },

      advertisement: {
        text: {
          header: String
        }
      },

      commentsSection: {
        text: {
          header: String
        },
        dataLocale: String
      },
      
      datalayer: {

        // ************ metadata ************ //
        thisCompany:{
          logoImg: String,
        },

        service: {
          status: Number,
          downSince: mongoose.Mixed,
          nameCase: String,
          nameHyphen: String,
          logoImage: String,
          logoImageAlt: String,
        },
             
        seo: {
            cumulativeSearchVolume:Number,
        },
        
          language: {
            name: String,
            nameHyphen: String,
            endonym: String,
            code: String
          },
          country: {
            geonameCode: Number,
            name: String,
            nameHyphen: String,
            code: String,
            flagImage: String,
            flagImageAlt: String
          },
          state: {
            geonameCode: Number,
            name: String,
            nameHyphen: String,
            asciiName: String,
            asciiNameHyphen: String,
            code: mongoose.Mixed
          },
          city: {
            geonameCode: Number,
            name: String,
            nameHyphen: String,
            asciiName: String,
            asciiNameHyphen: String
          },
        
          // ************ service ************ //
          serviceView:{

            header:{
              notDown: String,
              maybeDown: String,
              isDown: String,
              },

            modal: {
              reportProblem: {
                   header: String,
                   paragraph: String,
               }
             },
           
            downChart: {
              labelNow: String,
              tooltipLabel: String,
              timeReportsSequence: Array,
            },


          // ************ homepage ************ //
          homepageView:{
            header: String,
          },

      },


    },
  },
  },
})

serviceSchema.set('autoIndex', false)
serviceSchema.set('autoCreate', false)
serviceSchema.set('minimize', false)
serviceSchema.set('timestamps', { currentTime: () => new Date().toISOString() })

const schemaBaseReferences = {
  languageCode: 'viewLocals.body.datalayer.language.code',
  countryCode: 'viewLocals.body.datalayer.country.code',
  nameHyphen: 'viewLocals.body.datalayer.service.nameHyphen',
  cityName: 'viewLocals.body.datalayer.city.asciiNameHyphen',
}

const schemaAdditionalReferences = {
  countryFlagImg: 'viewLocals.body.datalayer.country.flagImage',
  countryFlagAlt: 'viewLocals.body.datalayer.country.flagImageAlt',
  languageEndonym: 'viewLocals.body.datalayer.language.endonym',
  seoCumulativeSearchVolume: 'viewLocals.body.datalayer.seo.cumulativeSearchVolume',
  nameCase: 'viewLocals.body.datalayer.service.nameCase',
}


require('./statics/getViewLocals.js')(serviceSchema, schemaBaseReferences)

// head
require('./virtuals/getHeadLanguage.js')(serviceSchema)
require('./statics/getHeadRelAlternate.js')(serviceSchema, schemaBaseReferences)
require('./methods/getHeadCanonical.js')(serviceSchema)

// nav
require('./methods/getNavlogoLink.js')(serviceSchema)
require('./methods/getNavHeaderLink.js')(serviceSchema)
require('./virtuals/getNavLogoImg.js')(serviceSchema)
require('./virtuals/getNavCountryFlagImg.js')(serviceSchema)
require('./virtuals/getNavCountryFlagAlt.js')(serviceSchema)

// header
require('./virtuals/getHeaderTitle.js')(serviceSchema)

// serviceDetails
require('./virtuals/getServiceDetailsLogoImg.js')(serviceSchema)
require('./virtuals/getServiceDetailsLogoAlt.js')(serviceSchema)

// about
require('./methods/getAboutBreadcrumb.js')(serviceSchema)

// modal
require('./statics/getModalGeolocationFlags.js')(serviceSchema, schemaBaseReferences, schemaAdditionalReferences)
require('./statics/getModalCountryAlternativeFlags.js')(serviceSchema, schemaBaseReferences, schemaAdditionalReferences)
require('./statics/getModalPositionPushingFlags.js')(serviceSchema, schemaBaseReferences, schemaAdditionalReferences)

// datalayer

module.exports = mongoose.model('Service', serviceSchema)
