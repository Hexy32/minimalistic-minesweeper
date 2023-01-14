import { Action, Game } from '../App'

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
      <h2 className={styles.text}>{game.hasWon ? 'You Won!' : 'Game Over'}</h2>
      <button
        className={styles.restart}
        onClick={() => {
          dispatch({ type: 'regenerate-board' })
        }}
      >
        Restart
      </button>
      <div>
        <p className={styles.time}>
          Time taken: {game.finalTime} second{game.finalTime === 1 || 's'}!
        </p>
        {!game.hasWon && <p className={styles.time}>Bombs not flagged: {getBombsRemaining()}</p>}
      </div>
    </section>
  )
}

type CompletionProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
