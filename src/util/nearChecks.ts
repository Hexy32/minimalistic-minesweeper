import { Action, Game, Tile } from './../types'

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

  static getNumberOfFlagsAround({ tile, game }: Props) {
    let flagCount = 0

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        if (x === tile.cords.x && y === tile.cords.y) {
          continue
        }

        if (game.tiles.find(({ cords }) => cords.x === x && cords.y === y)?.isFlagged === true) {
          flagCount += 1
        }
      }
    }
    return flagCount
  }

  static recursivelyOpenAround({ tile, game, dispatch }: SetProps) {
    const newArr = [...game.tiles]
    const edgeTiles = [] as Tile[]

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        const currentTile = game.tiles.find(({ cords }) => cords.x === x && cords.y === y)

        if (!(currentTile && !currentTile.isOpen)) continue

        const i = game.tiles.indexOf(currentTile)
        newArr[i].isOpen = true
        newArr[i].isFlagged = false
        newArr[i].number = this.getNumberOfBombsAround({ tile: currentTile, game })

        if (tile.cords.x === x && tile.cords.y === y) continue
        if (currentTile && currentTile.number === 0) {
          edgeTiles.push(currentTile)
        }
      }
    }

    dispatch({ type: 'set-tiles', payload: newArr })

    edgeTiles.forEach(tile => {
      this.recursivelyOpenAround({ tile, game, dispatch })
    })
  }

  // In Minesweeper, chording may refer to a tactic which is traditionally done
  // to uncover all eight adjacent squares if it has the correct number of flags.
  static chord({ tile, game }: Props) {
    const tilesToOpen: Tile[] = []

    for (let x = tile.cords.x - 1; x <= tile.cords.x + 1; x++) {
      for (let y = tile.cords.y - 1; y <= tile.cords.y + 1; y++) {
        if (x === tile.cords.x && y === tile.cords.y) {
          continue
        }

        const currentTile = game.tiles.find(({ cords }) => cords.x === x && cords.y === y)

        if (!currentTile || currentTile.isOpen || currentTile.isFlagged) continue

        tilesToOpen.push(currentTile)
      }
    }

    return tilesToOpen
  }
}

type Props = {
  tile: Tile
  game: Game
}

interface SetProps extends Props {
  dispatch: React.Dispatch<Action>
}
