import { Action, Game, Tile } from '../App'
import React, { useState } from 'react'

import InteractionMenu from './fragments/InteractionMenu'
import bomb from '/assets/bomb.svg'
import calculateItemSize from '../util/calculateItemSize'
import flag from '/assets/flag.svg'
import generateBombs from '../util/generateBombs'
import nearChecks from '../util/nearChecks'
import styles from '../styles/board.module.css'

type InteractionMenu =
  | {
      open: false
    }
  | { open: true; x: number; y: number; tile: Tile }

export default function Board({ mobile, game, dispatch }: BoardProps) {
  const [interactionMenu, setInteractionMenu] = useState<InteractionMenu>({ open: false })

  function handleResize() {
    calculateItemSize(game.dimensions.width, game.dimensions.height)
  }

  window.removeEventListener('resize', handleResize)
  window.addEventListener('resize', handleResize)

  calculateItemSize(game.dimensions.width, game.dimensions.height)

  function openTile(tile: Tile) {
    if (tile.isBomb) {
      dispatch({ type: 'set-over', payload: true })
      dispatch({ type: 'set-started', payload: false })
      return
    }

    const newArr = [...game.tiles]
    const i = game.tiles.indexOf(tile)

    newArr[i].isFlagged = false
    newArr[i].isOpen = true
    newArr[i].number = nearChecks.getNumberOfBombsAround({ tile, game })

    //Start recursive sweep if the tile was a 0
    if (newArr[i].number === 0) nearChecks.openAround({ tile, game, dispatch })

    dispatch({ type: 'set-tiles', payload: newArr })
  }

  function flagTile(tile: Tile) {
    const i = game.tiles.indexOf(tile)

    if (tile.isOpen) return

    const newArr = [...game.tiles]

    newArr[i].isFlagged = !tile.isFlagged

    dispatch({ type: 'set-tiles', payload: newArr })
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const [x, y] = e.currentTarget.id.split(' ')
    const tile = game.tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!

    setInteractionMenu({
      open: false,
    })

    if (game.over || game.hasWon || tile.isOpen) return

    if (!game.started) {
      //For initial game start, generate the bombs
      do {
        generateBombs(game, dispatch)
        //Generate until the initial tile is a 0
      } while (tile.isBomb || nearChecks.getNumberOfBombsAround({ tile, game }))

      dispatch({ type: 'set-started', payload: true })

      return openTile(tile)
    }

    if (mobile) {
      setInteractionMenu({
        open: true,
        x: e.currentTarget.offsetTop,
        y: e.currentTarget.offsetLeft,
        tile: tile,
      })
      return
    }

    tile.isFlagged || openTile(tile)
  }

  function handleRightClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (!game.started || game.hasWon) return

    const [x, y] = e.currentTarget.id.split(' ')
    const tile = game.tiles.find(({ cords }) => cords.x === parseInt(x) && cords.y === parseInt(y))!

    flagTile(tile)
  }

  return (
    <main className={styles.tilesGrid}>
      {interactionMenu.open && (
        <InteractionMenu
          openTile={openTile}
          flagTile={flagTile}
          close={() => setInteractionMenu({ open: false })}
          position={{ x: interactionMenu.x, y: interactionMenu.y }}
          tile={interactionMenu.tile}
        />
      )}
      {game.tiles.map((tile, i) => {
        return (
          <button
            onClick={handleClick}
            onContextMenu={handleRightClick}
            data-tile
            style={{ userSelect: 'none' }}
            key={i}
            id={tile.cords.x + ' ' + tile.cords.y}
            className={tile.isOpen ? styles.open : styles.update}
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
  mobile: boolean
  game: Game
  dispatch: React.Dispatch<Action>
}
