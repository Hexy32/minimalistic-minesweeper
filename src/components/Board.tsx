import { Action, Game } from '../App'

import React from 'react'
import bomb from '/assets/bomb.svg'
import calculateItemSize from '../util/calculateItemSize'
import flag from '/assets/flag.svg'
import generateBombs from '../util/generateBombs'
import nearChecks from '../util/nearChecks'
import styles from '../styles/board.module.css'

export default function Board({ game, dispatch }: BoardProps) {
  function handleResize() {
    calculateItemSize(game.dimensions.width, game.dimensions.height)
  }
  window.removeEventListener('resize', handleResize)
  window.addEventListener('resize', handleResize)

  calculateItemSize(game.dimensions.width, game.dimensions.height)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const [x, y] = e.currentTarget.id.split(' ')
    const tile = game.tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!
    const i = game.tiles.indexOf(tile)

    const newArr = [...game.tiles]

    if (game.over || game.hasWon || tile.isFlagged) return

    if (!game.started) {
      do {
        generateBombs(game, dispatch)
      } while (tile.isBomb || nearChecks.getNumberOfBombsAround({ tile, game }))

      dispatch({ type: 'set-started', payload: true })
    }

    if (tile.isBomb) {
      //Game over code here
      dispatch({ type: 'set-over', payload: true })
      dispatch({ type: 'set-started', payload: false })
      return
    }

    newArr[i].isFlagged = false

    newArr[i].isOpen = true
    newArr[i].number = nearChecks.getNumberOfBombsAround({ tile, game })

    if (newArr[i].number === 0) nearChecks.openAround({ tile, game, dispatch })

    dispatch({ type: 'set-tiles', payload: newArr })
  }

  function handleRightClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (!game.started || game.hasWon) return

    const [x, y] = e.currentTarget.id.split(' ')
    const tile = game.tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!
    const i = game.tiles.indexOf(tile)

    if (tile.isOpen) return

    const newArr = [...game.tiles]

    newArr[i].isFlagged = tile.isFlagged ? false : true

    dispatch({ type: 'set-tiles', payload: newArr })
  }

  return (
    <main className={styles.tilesGrid}>
      {game.tiles.map((tile, i) => {
        return (
          <button
            onClick={handleClick}
            onContextMenu={handleRightClick}
            data-tile
            style={{ userSelect: 'none' }}
            key={i}
            id={tile.cords.x + ' ' + tile.cords.y}
            className={tile.isOpen ? styles.open : undefined}
          >
            {tile.number && !tile.isBomb ? tile.number : ''}
            {tile.isBomb && !game.started ? (
              <img draggable="false" src={bomb} alt="Bomb" />
            ) : undefined}
            {tile.isFlagged && game.started ? (
              <img draggable="false" src={flag} alt="Flag" />
            ) : undefined}
          </button>
        )
      })}
    </main>
  )
}

type BoardProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
