import { Action, Game } from '../types'

import styles from '../styles/completion.module.css'

export default function Completion({ game, dispatch }: CompletionProps) {
  function getBombsRemaining() {
    let x = 0
    game.tiles.forEach(tile => {
      if (tile.isBomb && !tile.isFlagged) x++
    })
    return x
  }

  return (
    <section className={styles.container}>
      <h2 className={game.hasWon ? styles.textWon : styles.textLost}>
        {game.hasWon ? 'You Won!' : 'Game Over'}
      </h2>
      <div>
        <p className={styles.time}>
          Time taken: {game.finalTime} second{game.finalTime === 1 || 's'}
        </p>
        {!game.hasWon && <p className={styles.time}>Bombs not flagged: {getBombsRemaining()}</p>}
      </div>
      <button
        className={styles.restart}
        onClick={() => {
          dispatch({ type: 'regenerate-board' })
        }}
      >
        Reset
      </button>
    </section>
  )
}

type CompletionProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
