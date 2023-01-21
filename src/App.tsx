import { useEffect, useMemo, useReducer, useRef, useState } from 'react'

import Board from './components/Board'
import Completion from './components/Completion'
import { Game } from './types'
import { Hamburger } from './components/Hamburger'
import Options from './components/Options'
import Stats from './components/Stats'
import Toast from './components/Toast'
import { createTiles } from './util/createTiles'
import reducer from './util/reducer'
import styles from './styles/app.module.css'
import toastStyles from './styles/toast.module.css'

const DEFAULT_GAME: Game = {
  tiles: [],
  started: false,
  over: false,
  hasWon: false,
  finalTime: -1,
  difficulty: 'easy',
  dimensions: {
    width: 10,
    height: 10,
  },
}

const TOAST_TIMEOUT = 2000
const MOBILE_THRESHOLD = 700

export default function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [game, dispatch] = useReducer(reducer, DEFAULT_GAME)

  useEffect(() => {
    //Do initial tile generation
    dispatch({
      type: 'set-tiles',
      payload: createTiles(game.dimensions.width, game.dimensions.height),
    })

    //For keyboard shortcuts
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

    //For window resizing
    function handleResize() {
      const root = getComputedStyle(document.querySelector(':root')!)

      function isTouchDevice() {
        return 'ontouchstart' in window
      }

      setIsMobile(
        parseInt(root.width.slice(0, root.width.length - 2)) < MOBILE_THRESHOLD || isTouchDevice
      )
    }

    handleResize()

    window.addEventListener('keyup', handleKeys)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('keyup', handleKeys)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  //Win and loose conditions
  const hasWon = useMemo(() => {
    if (!game.tiles.some(tile => !tile.isOpen && !tile.isBomb) && game.started) {
      return true
    } else if (game.hasWon) {
      return false
    }
  }, [game.tiles, game.started])

  useEffect(() => {
    if (hasWon === undefined || hasWon === game.hasWon) return

    if (hasWon) dispatch({ type: 'set-has-won', payload: true })
    else dispatch({ type: 'set-has-won', payload: false })
  }, [hasWon])

  //Toast logic
  const timeoutIdRef = useRef<number>()
  useEffect(() => {
    function removeToast() {
      const toastElem = document.getElementById('toast')
      toastElem?.classList.add(toastStyles.slideDown)
      function setUndefined() {
        dispatch({ type: 'show-toast', payload: undefined })
      }
      toastElem?.addEventListener('animationend', setUndefined, { once: true })
    }

    timeoutIdRef.current = setTimeout(removeToast, TOAST_TIMEOUT)
    return () => clearTimeout(timeoutIdRef.current)
  }, [game.currentToast])

  return (
    <div className={styles.app}>
      {/* Toasts to alert user when there is a state change */}
      {game.currentToast ? (
        <Toast
          message={game.currentToast.message}
          color={game.currentToast.color}
          func={game.currentToast.func}
        />
      ) : undefined}

      {/* Show the user the end-game stats */}
      {(game.over || game.hasWon) && <Completion game={game} dispatch={dispatch} />}

      {/* Based on weather user has a touchscreen/small device, show the options */}
      {isMobile ? (
        <Hamburger>
          <Options mobile game={game} dispatch={dispatch} />
        </Hamburger>
      ) : (
        <Options game={game} dispatch={dispatch} />
      )}

      {/* The main game board */}
      <Board mobile={isMobile} game={game} dispatch={dispatch} />

      {/* The ongoing game stats at the bottom of the screen */}
      <Stats game={game} dispatch={dispatch} />
    </div>
  )
}
