import { Tile } from '../App'

export default class nearChecks {
  static getNumberOfBombsAround({ tile, tiles }: Props) {
    let bombCount = 0

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        if (x === tile.cords.x && y === tile.cords.y) {
          continue
        }

        if (tiles.find(({ cords }) => cords.x === x && cords.y === y)?.isBomb === true) {
          bombCount += 1
        }
      }
    }
    return bombCount
  }

  static openAround({ tile, tiles, setTiles }: SetProps) {
    const newArr = [...tiles]
    const edgeTiles = [] as Tile[]

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        const currentTile = tiles.find(({ cords }) => cords.x === x && cords.y === y)

        if (!(currentTile && !currentTile.isOpen)) continue

        const i = tiles.indexOf(currentTile)
        newArr[i].isOpen = true
        newArr[i].number = this.getNumberOfBombsAround({ tile: currentTile, tiles })

        if (tile.cords.x === x && tile.cords.y === y) continue
        if (currentTile && currentTile.number === 0) {
          edgeTiles.push(currentTile)
        }
      }
    }

    setTiles(newArr)

    edgeTiles.forEach(tile => {
      this.openAround({ tile, tiles, setTiles })
    })
  }
}

interface Props {
  tile: Tile
  tiles: Tile[]
}

interface SetProps extends Props {
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>
}

interface Cords {
  x: number
  y: number
}
