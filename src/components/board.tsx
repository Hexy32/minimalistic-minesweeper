import React, { useEffect, useState } from 'react'

import { Tile } from '../App'
import bomb from '../assets/bomb.svg'
import flag from '../assets/flag.svg'
import generateBombs from '../util/generateBombs'
import nearChecks from '../util/nearChecks'
import styles from '../styles/board.module.css'

export default function Board({
  width,
  height,
  difficulty,
  tiles,
  setTiles,
  gameStarted,
  setGameStarted,
}: BoardProps) {
  const [gameOver, setGameOver] = useState(false)

  //Restart game if there is any change to the settings
  useEffect(() => {
    setGameStarted(false)
    setGameOver(false)
  }, [width, height, difficulty])

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const [x, y] = e.currentTarget.id.split(' ')
    const tile = tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!
    const i = tiles.indexOf(tile)

    const newArr = [...tiles]

    if (gameOver) return

    if (!gameStarted) {
      do {
        generateBombs(width, height, difficulty, tiles, setTiles)
      } while (tile?.isBomb === true)

      setGameStarted(true)
    }

    if (tile.isBomb) {
      //Game over code here
      setGameOver(true)
      setGameStarted(false)
      return
    }

    newArr[i].isFlagged = false

    newArr[i].isOpen = true
    newArr[i].number = nearChecks.getNumberOfBombsAround({ tile, tiles })

    if (newArr[i].number === 0) nearChecks.openAround({ tile, tiles, setTiles })

    setTiles(newArr)
  }

  function handleRightClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (!gameStarted) return

    const [x, y] = e.currentTarget.id.split(' ')
    const tile = tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!
    const i = tiles.indexOf(tile)

    if (tile.isOpen) return

    const newArr = [...tiles]

    newArr[i].isFlagged = tile.isFlagged ? false : true

    setTiles(newArr)
  }

  return (
    <main className={styles.tilesGrid}>
      {tiles.map((tile, i) => {
        return (
          <button
            onClick={handleClick}
            onContextMenu={handleRightClick}
            key={i}
            id={tile.cords.x + ' ' + tile.cords.y}
            className={
              tile.isBomb ? undefined : undefined + ' ' + (tile.isOpen ? styles.open : undefined)
            }
          >
            {tile.number && !tile.isBomb ? tile.number : ''}
            {tile.isBomb && !gameStarted ? (
              <img draggable="false" src={bomb} alt="Bomb" />
            ) : undefined}
            {tile.isFlagged && gameStarted ? (
              <img draggable="false" src={flag} alt="Flag" />
            ) : undefined}
          </button>
        )
      })}
    </main>
  )
}

interface BoardProps {
  width: number
  height: number
  difficulty: string
  tiles: Tile[]
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>
  gameStarted: boolean
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
}
