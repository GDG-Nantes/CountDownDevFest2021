import { FONT_LIST } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

export class TestFonts {
  constructor() {
    this.index = 0
    this.showAllFonts()
  }

  showAllFonts() {
    const text = `Hello #@!,?=' 09`
    const color = '#ec6453'
    for (let font of FONT_LIST) {
      //this.addText(font, color, text, 'jef')
      this.addText(font, color, 'abcdefghihjklmonpqrstuvwxy...', 'jef')
      //this.addText(font, color, 'hello', 'jef')
      //this.addText(font, color, 'Hello', 'jef')
    }
  }

  addText(fontToUse, color, text, credits) {
    const container = document.createElement('DIV')
    container.classList.add('draw-area-container-test')
    const descriptionFont = document.createElement('DIV')
    descriptionFont.classList.add('draw-area-desc')
    descriptionFont.innerHTML = `fontname: ${fontToUse.fontFile}/multiplier: ${fontToUse['font-size-multiplier']}/ avoidNumbers: ${fontToUse.avoidNumbers}/ avoidSpecialChars: ${fontToUse.avoidSpecialChars}`
    container.appendChild(descriptionFont)
    const textElt = document.createElement('DIV')
    textElt.classList.add('draw-area-text')
    textElt.id = `draw-area${this.index}`
    this.index++
    textElt.dataset.credits = credits.toLocaleUpperCase()
    container.appendChild(textElt)
    document.querySelector('.draw-area-test').appendChild(container)

    const fontInSVG = new SVGTextAnimate(
      `./css/fonts/${fontToUse.fontFile}`,
      {
        duration: 0,
        direction: 'normal',
        'fill-mode': 'forwards',
        delay: 0,
        mode: 'sync',
      },
      {
        fill: color,
        stroke: color,
        'stroke-width': fontToUse['stroke-width'],
        'font-size': 100 * fontToUse['font-size-multiplier'],
      },
    )
    fontInSVG.setFont().then((_) => {
      fontInSVG.create(text, `#${textElt.id}`)
    })
  }
}
