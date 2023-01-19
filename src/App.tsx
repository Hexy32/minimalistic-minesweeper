import { useEffect, useReducer, useState } from 'react'

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
  useEffect(() => {
    if (!game.tiles.some(tile => !tile.isOpen && !tile.isBomb) && game.started) {
      dispatch({ type: 'set-has-won', payload: true })
    } else if (game.hasWon) {
      dispatch({ type: 'set-has-won', payload: false })
    }
  }, [game.tiles])

  //Toast logic
  const [timeoutId, setTimeoutId] = useState<number | undefined>()
  useEffect(() => {
    function removeToast() {
      const toastElem = document.getElementById('toast')
      toastElem?.classList.add(toastStyles.slideDown)
      function setUndefined() {
        dispatch({ type: 'show-toast', payload: undefined })
      }
      toastElem?.addEventListener('animationend', setUndefined, { once: true })
    }
    clearTimeout(timeoutId)
    setTimeoutId(setTimeout(removeToast, TOAST_TIMEOUT))
  }, [game.currentToast])

  return (
    <div className={styles.app}>
      {game.currentToast ? (
        <Toast
          message={game.currentToast.message}
          color={game.currentToast.color}
          func={game.currentToast.func}
        />
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
