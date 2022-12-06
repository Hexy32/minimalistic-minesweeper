import { Tile } from '../App'

export function createTiles(width: number, height: number) {
  const newArr = [] as Tile[]

  for (let y = height; y >= 1; y--) {
    for (let x = 1; x <= width; x++) {
      // const isBomb = randomCords.some(cords => cords.x === x && cords.y === y)

      newArr.push({
        cords: { x: x, y: y },
        isBomb: false,
        isOpen: false,
        isFlagged: false,
        number: undefined,
      })
    }
  }

  return newArr
}
