import { Action, Game } from '../types'

import { createTiles } from './createTiles'

export default function reducer(game: Game, action: Action): Game {
  switch (action.type) {
    case 'set-tiles':
      return {
        ...game,
        tiles: action.payload,
      }
    case 'set-started':
      return {
        ...game,
        started: action.payload,
      }
    case 'set-difficulty':
      return {
        ...game,
        difficulty: action.payload,
      }
    case 'set-over':
      return {
        ...game,
        over: action.payload,
      }
    case 'set-width':
      return {
        ...game,
        dimensions: {
          ...game.dimensions,
          width: action.payload,
        },
      }
    case 'set-height':
      return {
        ...game,
        dimensions: {
          ...game.dimensions,
          height: action.payload,
        },
      }
    case 'set-has-won':
      return {
        ...game,
        hasWon: action.payload,
      }
    case 'set-final-time':
      return {
        ...game,
        finalTime: action.payload,
      }
    case 'regenerate-board':
      return {
        ...game,
        finalTime: -1,
        tiles: createTiles(game.dimensions.width, game.dimensions.height),
        started: false,
        over: false,
      }
    case 'show-toast':
      return { ...game, currentToast: action.payload }
    default:
      throw new Error('Action type not found!')
  }
}
