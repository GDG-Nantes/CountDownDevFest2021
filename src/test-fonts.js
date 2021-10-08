import { FONT_LIST } from './font-list'
import SVGTextAnimate from '../vendors/svg-text-animate-fork/src/svg-text-animate.js'

const BRUSH = [
  {
    name: 'brush-1.svg',
    ratioHeight: 268 / 1001,
    ratioWidth: 1001 / 268,
  },
  {
    name: 'brush-stroke-banner-1-resize.svg',
    ratioHeight: 366 / 1001,
    ratioWidth: 1001 / 366,
  },
  {
    name: 'brush-stroke-banner-5-resize.svg',
    ratioHeight: 305 / 1024,
    ratioWidth: 1024 / 305,
  },
  {
    name: 'brush-stroke-banner-7-resize.svg',
    ratioHeight: 237 / 1000,
    ratioWidth: 1000 / 237,
  },
  {
    name: 'banner-2-resize.svg',
    ratioHeight: 187 / 1001,
    ratioWidth: 1001 / 187,
  },
]
export class TestFonts {
  constructor() {
    this.index = 0
    this.showAllFonts()
  }

  showAllFonts() {
    const text = `Hello #@!,?=' 09`
    const color = '#ec6453'
    let first = true
    for (let font of FONT_LIST) {
      //this.addText(font, color, text, 'jef')
      if (first) {
        first = false
        for (let brush of BRUSH) {
          this.addText(font, brush, color, 'abcdefghihjklmonpqrstuvwxy...', 'jef')
          this.addText(font, brush, color, 'test', 'jef')
        }
      } else {
        this.addText(font, BRUSH[0], color, 'abcdefghihjklmonpqrstuvwxy...', 'jef')
      }
      //this.addText(font, color, 'hello', 'jef')
      //this.addText(font, color, 'Hello', 'jef')
    }
  }

  addText(fontToUse, brush, color, text, credits) {
    const container = document.createElement('DIV')
    container.classList.add('draw-area-container-test')

    const svgBgElt = document.createElement('DIV')
    svgBgElt.classList.add('draw-area-svg-bg')
    const imgSvgBgElt = document.createElement('IMG')
    imgSvgBgElt.src = `./assets/images/${brush.name}`
    imgSvgBgElt.style.setProperty('--filter-svg', 'invert(20%)')
    svgBgElt.appendChild(imgSvgBgElt)
    container.appendChild(svgBgElt)

    const descriptionFont = document.createElement('DIV')
    descriptionFont.classList.add('draw-area-desc')
    descriptionFont.innerHTML = `fontname: ${fontToUse.fontFile}/multiplier: ${fontToUse['font-size-multiplier']}/ avoidNumbers: ${fontToUse.avoidNumbers}/ avoidSpecialChars: ${fontToUse.avoidSpecialChars}/brush: ${brush.name}`
    descriptionFont.style = 'position:absolute; top: 10px; white-space:nowrap;'
    container.appendChild(descriptionFont)

    const textElt = document.createElement('DIV')
    textElt.classList.add('draw-area-text')
    textElt.id = `draw-area${this.index}`
    this.index++
    textElt.dataset.credits = credits.toLocaleUpperCase()
    textElt.style = `position:relative; font-family: 'Urban Brush', cursive !important; color: ${color};`
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

      const svgTextElt = document.querySelector(`#${textElt.id} svg`)
      // we retreive size of svg to inject it in img
      const widthFromSVG = +svgTextElt.style.getPropertyValue('--width-svg')
      const heightFromSVG = +svgTextElt.style.getPropertyValue('--height-svg')
      let widthSVG = widthFromSVG * 1.2
      let heightSVG = widthSVG * brush.ratioHeight

      if (heightSVG < heightFromSVG * 1.2) {
        heightSVG = heightFromSVG * 1.2
        widthSVG = heightSVG * brush.ratioWidth
      }

      svgBgElt.style.setProperty('--height-svg', `${heightSVG}px`)
      svgBgElt.style.setProperty('--width-svg', `${widthSVG}px`)
      svgBgElt.parentElement.style.setProperty('--width-svg', `${widthSVG}px`)
      svgBgElt.parentElement.style = `height: ${heightSVG}px; width:${widthSVG}px ;`
      imgSvgBgElt.width = widthSVG
      imgSvgBgElt.height = heightSVG
    })
  }
}
