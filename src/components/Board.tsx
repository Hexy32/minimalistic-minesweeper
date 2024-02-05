import { Action, Game, Tile } from '../types'
import React, { useCallback, useEffect, useState } from 'react'

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
	const handleResizeCallback = useCallback(
		() => calculateItemSize(game.dimensions.width, game.dimensions.height),
		[game.dimensions.width, game.dimensions.height]
	)

	useEffect(() => {
		window.addEventListener('resize', handleResizeCallback)
		return () => window.removeEventListener('resize', handleResizeCallback)
	}, [handleResizeCallback])

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
		if (newArr[i].number === 0) nearChecks.recursivelyOpenAround({ tile, game, dispatch })

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

		if (game.over || game.hasWon) return

		if (tile.isOpen) {
			if (tile.number === 0) return

			const numberOfFlags = nearChecks.getNumberOfFlagsAround({ tile, game })
			if (numberOfFlags < tile.number) return

			const tilesToOpen = nearChecks.chord({ tile, game })

			const tilesWithBomb = tilesToOpen.filter((tile) => tile.isBomb)

			// End the game if there was a bomb that was not flagged.
			if (tilesWithBomb.length > 0) {
				dispatch({ type: 'set-over', payload: true })
				dispatch({ type: 'set-started', payload: false })
				return
			}

			console.log(tilesToOpen)

			return tilesToOpen.forEach((tile) => openTile(tile))
		}

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

	function getBackgroundColor(n: number) {
		const colorOpacity = '40'
		switch (n) {
			case 0:
				return '#2e2e2e'
			case 1:
				return '#225071' + colorOpacity
			case 2:
				return '#1d791d' + colorOpacity
			case 3:
			case 6:
				return '#7a1e1e' + colorOpacity
			case 4:
				return '#791d79' + colorOpacity
			case 5:
				return '#78791d' + colorOpacity
		}
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
						style={{
							userSelect: 'none',
							background: tile.isBomb ? '' : '',
							backgroundColor:
								!tile.isOpen || (tile.isOpen && tile.isBomb)
									? 'var(--main-color)'
									: getBackgroundColor(tile.number ?? 0),
						}}
						key={i}
						id={tile.cords.x + ' ' + tile.cords.y}
						className={tile.isOpen ? styles.open : styles.update}>
						{tile.number && !tile.isBomb ? tile.number : ''}
						{tile.isBomb && !game.started ? (
							<img
								draggable='false'
								src={bomb}
								alt='Bomb'
							/>
						) : undefined}
						{tile.isFlagged && game.started ? (
							<img
								draggable='false'
								src={flag}
								alt='Flag'
							/>
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
