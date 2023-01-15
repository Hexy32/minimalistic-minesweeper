import { Tile } from '../../App'
import flag from '/assets/flag.svg'
import shovel from '/assets/shovel.svg'
import styles from '../../styles/interactionMenu.module.css'
import { useEffect } from 'react'

export default function InteractionMenu({
  openTile,
  flagTile,
  close,
  position,
  tile,
}: InteractionMenuProps) {
  const tileElem = document.getElementById(tile.cords.x + ' ' + tile.cords.y)!
  tileElem.addEventListener(
    'blur',
    () => {
      close()
    },
    { once: true }
  )

  useEffect(() => {
    const root = getComputedStyle(document.querySelector<HTMLHtmlElement>(':root')!)
    const tileSize = root.getPropertyValue('--tileSize')
    const interactionMenuElem = getComputedStyle(document.getElementById('interactionMenu')!)

    let positionTop = position.x - turnPxIntoNumber(interactionMenuElem.height)
    let positionLeft =
      position.y + turnPxIntoNumber(tileSize) / 2 - turnPxIntoNumber(interactionMenuElem.width) / 2

    if (positionLeft + turnPxIntoNumber(interactionMenuElem.width) > turnPxIntoNumber(root.width)) {
      positionLeft = turnPxIntoNumber(root.width) - turnPxIntoNumber(interactionMenuElem.width)
    } else if (positionLeft < 0) {
      positionLeft = 0
    }

    if (positionTop < 0) {
      positionTop = 0
    }

    function turnPxIntoNumber(px: string) {
      return parseInt(px.slice(0, tileSize.length - 2))
    }

    document.getElementById('interactionMenu')!.style.top = positionTop + 'px'
    document.getElementById('interactionMenu')!.style.left = positionLeft + 'px'
  }, [position])

  return (
    <div
      id="interactionMenu"
      onBlur={() => close()}
      className={styles.wrapper}
      style={{
        top: 0,
        left: 0,
      }}
    >
      <button
        onClick={() => {
          openTile(tile)
          close()
        }}
        className={styles.buttons}
      >
        <img className={styles.icons} draggable="false" src={shovel} alt="Open tile" />
      </button>
      <button
        onClick={() => {
          flagTile(tile)
          close()
        }}
        className={styles.buttons}
      >
        <img className={styles.icons} draggable="false" src={flag} alt="Flag tile" />
      </button>
    </div>
  )
}

type InteractionMenuProps = {
  close: () => void
  flagTile: (tile: Tile) => void
  openTile: (tile: Tile) => void
  tile: Tile
  position: {
    x: number
    y: number
  }
}
