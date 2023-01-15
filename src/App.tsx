import { useEffect, useReducer, useState } from 'react'

import Board from './components/Board'
import Completion from './components/Completion'
import { Hamburger } from './components/Hamburger'
import Options from './components/Options'
import Stats from './components/Stats'
import Toast from './components/Toast'
import { createTiles } from './util/createTiles'
import styles from './styles/app.module.css'
import toastStyles from './styles/toast.module.css'

const DEFAULT_GAME: Game = {
  tiles: [],
  started: false,
  over: false,
  hasWon: false,
  finalTime: 0,
  difficulty: 'easy',
  dimensions: {
    width: 10,
    height: 10,
  },
}

const TOAST_TIMEOUT = 2000
const MOBILE_THRESHOLD = 700

export default function App() {
  const [currentToast, setCurrentToast] = useState<Toast | undefined>(undefined)
  const [isMobile, setIsMobile] = useState(false)

  function reducer(game: Game, action: Action) {
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
          tiles: createTiles(game.dimensions.width, game.dimensions.height),
          started: false,
          over: false,
        }
      case 'show-toast':
        setCurrentToast(action.payload)
        return game
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
    function handleKeys(e: KeyboardEvent) {
      if (e.key === 'r') {
        dispatch({ type: 'regenerate-board' })
        dispatch({
          type: 'show-toast',
          payload: {
            message: `Board reset`,
            color: '#0c8ce9',
          },
        })
      }
    }

    window.removeEventListener('keyup', handleKeys)
    window.addEventListener('keyup', handleKeys)
  }, [])

  useEffect(() => {
    if (!game.tiles.some(tile => !tile.isOpen && !tile.isBomb) && game.started) {
      dispatch({ type: 'set-has-won', payload: true })
    } else if (game.hasWon) {
      dispatch({ type: 'set-has-won', payload: false })
    }
  }, [game.tiles])

  const [timeoutId, setTimeoutId] = useState<number | undefined>()
  useEffect(() => {
    function removeToast() {
      const toastElem = document.getElementById('toast')
      toastElem?.classList.add(toastStyles.slideDown)
      function setUndefined() {
        setCurrentToast(undefined)
      }
      toastElem?.addEventListener('animationend', setUndefined, { once: true })
    }
    clearTimeout(timeoutId)
    setTimeoutId(setTimeout(removeToast, TOAST_TIMEOUT))
  }, [currentToast])

  useEffect(() => {
    function handleResize() {
      const root = getComputedStyle(document.querySelector(':root')!)

      function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0
      }

      // setIsMobile(parseInt(root.width.slice(0, root.width.length - 2)) < MOBILE_THRESHOLD)
      setIsMobile(
        parseInt(root.width.slice(0, root.width.length - 2)) < MOBILE_THRESHOLD || isTouchDevice
      )
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return document.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.app}>
      {currentToast ? (
        <Toast message={currentToast.message} color={currentToast.color} func={currentToast.func} />
      ) : undefined}
      {(game.hasWon || game.over) && <Completion game={game} dispatch={dispatch} />}
      {isMobile ? (
        <Hamburger>
          <Options mobile game={game} dispatch={dispatch} />
        </Hamburger>
      ) : (
        <Options game={game} dispatch={dispatch} />
      )}
      <Board mobile={isMobile} game={game} dispatch={dispatch} />
      <Stats game={game} dispatch={dispatch} />
    </div>
  )
}

export type Game = {
  tiles: Tile[]
  started: boolean
  over: boolean
  hasWon: boolean
  finalTime: number
  difficulty: Difficulty
  dimensions: {
    width: number
    height: number
  }
}

type Toast = {
  color: string
  message: string
  func?: () => void
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master'

export type Action =
  | { type: 'set-difficulty'; payload: Difficulty }
  | {
      type: 'set-width' | 'set-height' | 'set-final-time'
      payload: number
    }
  | {
      type: 'set-started' | 'set-over' | 'set-has-won'
      payload: boolean
    }
  | {
      type: 'set-tiles'
      payload: Tile[]
    }
  | {
      type: 'regenerate-board'
    }
  | {
      type: 'show-toast'
      payload: Toast
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
