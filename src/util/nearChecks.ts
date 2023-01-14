import { Action, Game } from './../App'

import { Tile } from '../App'

export default class nearChecks {
  static getNumberOfBombsAround({ tile, game }: Props) {
    let bombCount = 0

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        if (x === tile.cords.x && y === tile.cords.y) {
          continue
        }

        if (game.tiles.find(({ cords }) => cords.x === x && cords.y === y)?.isBomb === true) {
          bombCount += 1
        }
      }
    }
    return bombCount
  }

  static openAround({ tile, game, dispatch }: SetProps) {
    const newArr = [...game.tiles]
    const edgeTiles = [] as Tile[]

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        const currentTile = game.tiles.find(({ cords }) => cords.x === x && cords.y === y)

        if (!(currentTile && !currentTile.isOpen)) continue

        const i = game.tiles.indexOf(currentTile)
        newArr[i].isOpen = true
        newArr[i].number = this.getNumberOfBombsAround({ tile: currentTile, game })

        if (tile.cords.x === x && tile.cords.y === y) continue
        if (currentTile && currentTile.number === 0) {
          edgeTiles.push(currentTile)
        }
      }
    }

    dispatch({ type: 'set-tiles', payload: newArr })

    edgeTiles.forEach(tile => {
      this.openAround({ tile, game, dispatch })
    })
  }
}

type Props = {
  tile: Tile
  game: Game
}

interface SetProps extends Props {
  dispatch: React.Dispatch<Action>
}
