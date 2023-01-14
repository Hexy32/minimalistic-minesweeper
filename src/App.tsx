import { useEffect, useReducer } from 'react'

import Board from './components/board'
import Options from './components/options'
import Stats from './components/stats'
import { createTiles } from './util/createTiles'
import styles from './styles/app.module.css'

const DEFAULT_GAME: Game = {
  tiles: [],
  started: false,
  over: false,
  difficulty: 'easy',
  dimensions: {
    width: 10,
    height: 10,
  },
}

export default function App() {
  function reducer(game: Game, action: Action) {
    console.log(action.type, action.type !== 'regenerate-board' && action.payload, game)
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
      case 'regenerate-board':
        return {
          ...game,
          tiles: createTiles(game.dimensions.width, game.dimensions.height),
          started: false,
          over: false,
        }
      default:
        throw new Error('Action type not found!')
    }
  }

  const [game, dispatch] = useReducer(reducer, DEFAULT_GAME)

  useEffect(() => {
    dispatch({
      type: 'set-tiles',
      payload: createTiles(game.dimensions.width, game.dimensions.height),
    })
  }, [])

  return (
    <div className={styles.app}>
      <Options game={game} dispatch={dispatch} />
      <Board game={game} dispatch={dispatch} />
      <Stats game={game} />
    </div>
  )
}

export type Game = {
  tiles: Tile[]
  started: boolean
  over: boolean
  difficulty: Difficulty
  dimensions: {
    width: number
    height: number
  }
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master'

export type Action =
  | { type: 'set-difficulty'; payload: Difficulty }
  | {
      type: 'set-width' | 'set-height'
      payload: number
    }
  | {
      type: 'set-started' | 'set-over'
      payload: boolean
    }
  | {
      type: 'set-tiles'
      payload: Tile[]
    }
  | {
      type: 'regenerate-board'
    }

export type Tile = {
  cords: {
    x: number
    y: number
  }
  isBomb: boolean
  isOpen: boolean
  isFlagged: boolean
  number?: number
}
