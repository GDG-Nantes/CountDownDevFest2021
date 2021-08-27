'use strict'

const lastFonts = []
let lastFontIndex = 0
export const NUMBER_OF_TEXT_AREA = 10

function checkFontUse(font, constraints) {
  if (constraints.withSpecialChars && font.avoidSpecialChars) {
    return false
  }
  if (constraints.withNumbers && font.avoidNumbers) {
    return false
  }
  if (constraints.withUppercase && font.avoidUppercase) {
    return false
  }
  return !lastFonts.find((fontTemp) => fontTemp.fontFile === font.fontFile)
}

export function getNextFont(constraints) {
  let chooseFont = undefined
  let index = Math.floor(Math.random() * FONT_LIST.length)
  do {
    chooseFont = FONT_LIST[index]
    index = Math.floor(Math.random() * FONT_LIST.length)
  } while (!checkFontUse(chooseFont, constraints))
  lastFonts[lastFontIndex] = chooseFont
  lastFontIndex = (lastFontIndex + 1) % NUMBER_OF_TEXT_AREA
  return chooseFont
}

export const FONT_LIST = [
  // SlimWandals_PERSONAL
  {
    fontFile: 'SlimWandals_PERSONAL.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: true,
  },
  // docallismeonstreet
  {
    fontFile: 'docallismeonstreet.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // 08_Underground
  {
    fontFile: '08_Underground.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // aAttackGraffiti
  {
    fontFile: 'aAttackGraffiti.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // adrip1
  {
    fontFile: 'adrip1.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // aaaiight
  {
    fontFile: 'aaaiight.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Aerosol
  {
    fontFile: 'Aerosol.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // amsterdam
  {
    fontFile: 'amsterdam.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // BillyBop_MAJTAAG
  {
    fontFile: 'BillyBop_MAJTAAG.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Bombtrack_Demo
  {
    fontFile: 'Bombtrack_Demo.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // bopollux
  {
    fontFile: 'bopollux.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Califas_Demo
  {
    fontFile: 'Califas_Demo.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.65,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Cholo_Letters_Demo
  {
    fontFile: 'Cholo_Letters_Demo.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // chronic
  {
    fontFile: 'chronic.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // CORONA_COVID19
  {
    fontFile: 'CORONA_COVID19.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // degrassi_front
  {
    fontFile: 'degrassi_front.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // degrassi
  {
    fontFile: 'degrassi.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Dirty_lizard
  {
    fontFile: 'Dirty_lizard.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // DJGROSS
  {
    fontFile: 'DJGROSS.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.65,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Eazy_3
  {
    fontFile: 'Eazy_3.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Urban_Calligraphy
  {
    fontFile: 'Urban_Calligraphy.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // FAT&CAP
  {
    fontFile: 'FAT&CAP.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Felipe_Segundo
  {
    fontFile: 'Felipe_Segundo.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Freight_Train_Gangsta
  {
    fontFile: 'Freight_Train_Gangsta.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // From_Street_Art
  {
    fontFile: 'From_Street_Art.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Ghetto_Master
  {
    fontFile: 'Ghetto_Master.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // graffitistreet
  {
    fontFile: 'graffitistreet.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // graffitistreet3d
  {
    fontFile: 'graffitistreet3d.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Graffogie
  {
    fontFile: 'Graffogie.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // GRAFF___
  {
    fontFile: 'GRAFF___.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Hustlaz_Demo
  {
    fontFile: 'Hustlaz_Demo.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Inner_City
  {
    fontFile: 'Inner_City.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.6,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // JungleBold
  {
    fontFile: 'JungleBold.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Kolossal_black
  {
    fontFile: 'Kolossal_black.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.65,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Losdol
  {
    fontFile: 'Losdol.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: true,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Loudhailer
  {
    fontFile: 'Loudhailer.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Mostwasted
  {
    fontFile: 'Mostwasted.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Mwd_Graff
  {
    fontFile: 'Mwd_Graff.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // N!CE_Tag
  {
    fontFile: 'N!CE_Tag.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.5,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Nightvandals
  {
    fontFile: 'Nightvandals.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // OlSkool
  {
    fontFile: 'OlSkool.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Oldschool_Tag
  {
    fontFile: 'Oldschool_Tag.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Painterz
  {
    fontFile: 'Painterz.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // PeaceFight
  {
    fontFile: 'PeaceFight.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // PLAN-A-EMCEE
  {
    fontFile: 'PLAN-A-EMCEE.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // planet_benson_2
  {
    fontFile: 'planet_benson_2.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Real_Toyz
  {
    fontFile: 'Real_Toyz.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.45,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Rhieknuza
  {
    fontFile: 'Rhieknuza.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // RUFA
  {
    fontFile: 'RUFA.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: true,
  },
  // RuthlessDrippin1
  {
    fontFile: 'RuthlessDrippin1.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // RuthlessWreckin1
  {
    fontFile: 'RuthlessWreckin1.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Sadoc_Wild_DEMO
  {
    fontFile: 'Sadoc_Wild_DEMO.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // SequalRegular_PERSONAL_USE
  {
    fontFile: 'SequalRegular_PERSONAL_USE.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: true,
  },
  // Shockwave
  {
    fontFile: 'Shockwave.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Sick_Sketchlings
  {
    fontFile: 'Sick_Sketchlings.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.45,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Skatchboard
  {
    fontFile: 'Skatchboard.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // slammertag
  {
    fontFile: 'slammertag.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // SOUPER3
  {
    fontFile: 'SOUPER3.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.7,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Squizers_Marker_Demo
  {
    fontFile: 'Squizers_Marker_Demo.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.2,
    avoidSpecialChars: false,
    avoidUppercase: false,
    avoidNumbers: false,
  },
  // Streamzy
  {
    fontFile: 'Streamzy.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1.1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // subway
  {
    fontFile: 'subway.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // sweetasrevenge
  {
    fontFile: 'sweetasrevenge.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Sydney_Style
  {
    fontFile: 'Sydney_Style.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // The_Stamshons_Demo
  {
    fontFile: 'The_Stamshons_Demo.otf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // urban_decay
  {
    fontFile: 'urban_decay.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Urban_slick
  {
    fontFile: 'Urban_slick.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: false,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // UrbRapper
  {
    fontFile: 'UrbRapper.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.9,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // WelcometoTexas
  {
    fontFile: 'WelcometoTexas.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: true,
  },
  // Whole_trains
  {
    fontFile: 'Whole_trains.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 0.8,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
  // Y-Yo_Tags
  {
    fontFile: 'Y-Yo_Tags.ttf',
    'stroke-width': '1px',
    'font-size-multiplier': 1,
    avoidSpecialChars: true,
    avoidUppercase: true,
    avoidNumbers: false,
  },
]
