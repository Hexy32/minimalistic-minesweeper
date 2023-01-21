import { Action, Game } from '../types'
import { useEffect, useRef, useState } from 'react'

import styles from '../styles/stats.module.css'
import uiStyles from '../styles/ui.module.css'

export default function Stats({ game, dispatch }: StatsProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const [timePassed, setTimePassed] = useState(0)
  const [bombsRemaining, setBombsRemaining] = useState(0)

  const intervalIdRef = useRef<number>(0)

  useEffect(() => {
    if (game.started && !timerRunning) startTimer()
    if ((!game.started && timerRunning) || game.hasWon) stopTimer()

    const totalBombs = game.tiles.filter(tile => tile.isBomb === true).length
    const totalFlags = game.tiles.filter(tile => tile.isFlagged === true).length

    setBombsRemaining(totalBombs - totalFlags)
  }, [game.started, game.tiles, game.hasWon])

  function startTimer() {
    setTimerRunning(true)
    //Start timer code

    let startTime = Date.now()

    const calculateTimePassed = () => {
      setTimePassed(Math.round((Date.now() - startTime) / 1000))
    }

    calculateTimePassed()

    intervalIdRef.current = setInterval(calculateTimePassed, 1000)
  }

  function stopTimer() {
    dispatch({ type: 'set-final-time', payload: timePassed })
    setTimerRunning(false)
    //Stop timer code
    clearInterval(intervalIdRef.current)
  }

  function Info({ label, value }: { label: string; value: string | number }) {
    return (
      <div>
        <span>{label}: </span>
        <span>{value}</span>
      </div>
    )
  }

  return (
    <section className={uiStyles.ui + ' ' + styles.stats}>
      <Info label="Timer" value={timePassed} />
      <Info label="Bombs remaining" value={bombsRemaining} />
    </section>
  )
}

type StatsProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
