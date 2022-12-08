import { useEffect, useState } from 'react'

import { Tile } from '../App'
import styles from '../styles/stats.module.css'
import uiStyles from '../styles/ui.module.css'

export default function Stats({ gameStarted, tiles }: StatsProps) {
  const [timerRunning, setTimerRunning] = useState(false)
  const [timePassed, setTimePassed] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [bombsRemaining, setBombsRemaining] = useState(0)

  useEffect(() => {
    if (gameStarted && !timerRunning) startTimer()
    if (!gameStarted && timerRunning) stopTimer()

    const totalBombs = tiles.filter(tile => tile.isBomb === true).length
    const totalFlags = tiles.filter(tile => tile.isFlagged === true).length

    setBombsRemaining(totalBombs - totalFlags)
  }, [gameStarted, tiles])

  function startTimer() {
    setTimerRunning(true)
    //Start timer code

    let startTime = Date.now()
    setIntervalId(
      setInterval(() => {
        setTimePassed(Math.round((Date.now() - startTime) / 1000))
      }, 1000)
    )
  }

  function stopTimer() {
    setTimerRunning(false)
    //Stop timer code
    clearInterval(intervalId)
  }

  return (
    <section className={uiStyles.ui + ' ' + styles.stats}>
      <div>
        <span>Timer: </span>
        <span>{timePassed}</span>
      </div>
      <div>
        <span>Bombs remaining: </span>
        <span>{bombsRemaining}</span>
      </div>
    </section>
  )
}

interface StatsProps {
  gameStarted: boolean
  tiles: Tile[]
}
