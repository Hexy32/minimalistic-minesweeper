import { Action, Game } from '../types'

export default function generateBombs(game: Game, dispatch: React.Dispatch<Action>) {
  const newTiles = game.tiles.map(tile => {
    tile.isBomb = false
    return tile
  })
  const newArr = [...newTiles]
  const numberOfBombs = getNumberOfBombs(
    game.difficulty,
    game.dimensions.width * game.dimensions.height
  )

  const finalCords = [] as Cords[]

  for (let i = 0; i < numberOfBombs; i++) {
    let randomCords: Cords

    do {
      randomCords = {
        x: Math.ceil(Math.random() * game.dimensions.width),
        y: Math.ceil(Math.random() * game.dimensions.height),
      }

      // If there are no cords in the finalCords array, break the loop
      if (finalCords.length === 0) break
    } while (finalCords.some(cords => cords.x === randomCords.x && cords.y === randomCords.y))

    finalCords.push(randomCords)

    // Find the index of the tile with the randomly generated cords
    const index = newArr.findIndex(
      ({ cords }) => cords.x === randomCords.x && cords.y === randomCords.y
    )

    // If the index is not found, throw an error
    if (index === -1) {
      console.table(game.tiles)
      throw new Error(
        `Cant generate bomb, cord not found! Cords: ${randomCords.x} ${randomCords.y}`
      )
    }

    // Set the tile at the given index to be a bomb
    newArr[index].isBomb = true
  }

  dispatch({ type: 'set-tiles', payload: newArr })

  type Cords = {
    x: number
    y: number
  }
}

function getNumberOfBombs(difficulty: string, tilesTotal: number) {
  switch (difficulty) {
    case 'easy':
      return Math.round(tilesTotal * 0.1)
    case 'medium':
      return Math.round(tilesTotal * 0.15)
    case 'hard':
      return Math.round(tilesTotal * 0.2)
    case 'master':
      return Math.round(tilesTotal * 0.25)

    default:
      throw new Error('Difficulty not found!')
  }
}
