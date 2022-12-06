import { useEffect, useState } from 'react'

import Board from './components/board'
import Options from './components/options'
import calculateItemSize from './util/calculateItemSize'
import { createTiles } from './util/createTiles'
import styles from './styles/app.module.css'

export default function App() {
  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [difficulty, setDifficulty] = useState('easy')

  const [gameStarted, setGameStarted] = useState(false)

  const [tiles, setTiles] = useState(createTiles(width, height))

  function updateBoard() {
    setTiles(createTiles(width, height))
    setGameStarted(false)
  }

  useEffect(() => {
    updateBoard()

    function handleResize() {
      calculateItemSize(width, height)
    }

    window.removeEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    calculateItemSize(width, height)
  }, [width, height, difficulty])

  return (
    <div className={styles.app}>
      <Options
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        setHeight={setHeight}
        setWidth={setWidth}
        updateBoard={updateBoard}
      />
      <Board
        difficulty={difficulty}
        height={height}
        width={width}
        tiles={tiles}
        setTiles={setTiles}
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
      />
    </div>
  )
}

export interface Tile {
  cords: {
    x: number
    y: number
  }
  isBomb: boolean
  isOpen: boolean
  isFlagged: boolean
  number?: number
}
