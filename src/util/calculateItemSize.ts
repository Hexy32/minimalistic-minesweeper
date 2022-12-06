import getSmallest from './getSmallest'

export default function calculateItemSize(tilesWidth: number, tilesHeight: number) {
  const root = document.documentElement

  const gap = (100 - tilesHeight) / 30

  const mainHeight = window.innerHeight - 160
  const mainWidth = window.innerWidth - 50

  const inlineLimit = () => {
    let value = mainWidth - gap * (tilesWidth - 1)
    value /= tilesWidth

    return value
  }

  const blockLimit = () => {
    let value = mainHeight - gap * (tilesHeight - 1)
    value /= tilesHeight

    return value
  }

  const finalSize = getSmallest([blockLimit(), inlineLimit()])

  root.style.setProperty('--tileSize', finalSize.toString() + 'px')

  root.style.setProperty('--width', tilesWidth.toString())
  root.style.setProperty('--height', tilesHeight.toString())

  root.style.setProperty('--gap', gap.toString() + 'px')
}
