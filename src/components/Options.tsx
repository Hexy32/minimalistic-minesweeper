import { Action, Difficulty, Game } from '../App'

import styles from '../styles/options.module.css'
import uiStyles from '../styles/ui.module.css'

export default function Options({ game, dispatch }: OptionsProps) {
  let inputLock = false
  function handleUpdate(currentTarget: HTMLElement) {
    const buttonColor = document.documentElement.style.getPropertyValue('main-color')
    toggleInputs(false)

    const inputs = currentTarget.parentElement?.children!

    const difficulty = (inputs[0] as HTMLSelectElement).value as Difficulty

    let width = parseInt((inputs[1] as HTMLInputElement).value)
    let height = parseInt((inputs[2] as HTMLInputElement).value)

    function toggleInputs(lockOrUnlock: boolean) {
      if (lockOrUnlock) {
        currentTarget.style.backgroundColor = '#f15252'
        currentTarget.title = 'Must be between 5 and 50!'
        inputLock = true
      } else {
        currentTarget.style.backgroundColor = buttonColor
        currentTarget.title = ''
        inputLock = false
      }
    }

    const widthConstraint = width <= 4 || width > 50
    const heightConstraint = height <= 4 || height > 50

    if (widthConstraint || heightConstraint) {
      if (currentTarget.id === 'width' && widthConstraint) toggleInputs(true)
      if (currentTarget.id === 'height' && heightConstraint) toggleInputs(true)
      return
    }

    dispatch({ type: 'set-difficulty', payload: difficulty })

    if (!isNaN(width)) dispatch({ type: 'set-width', payload: width })
    if (!isNaN(height)) dispatch({ type: 'set-height', payload: height })

    dispatch({ type: 'regenerate-board' })
  }

  const difficulties = ['Easy', 'Medium', 'Hard', 'Master']

  return (
    <section className={uiStyles.ui}>
      <select
        onChange={e => handleUpdate(e.currentTarget)}
        name="Difficulty"
        id="difficulty"
        defaultValue={game.difficulty}
      >
        {difficulties.map(diff => {
          return (
            <option key={diff} value={diff.toLowerCase()}>
              {diff}
            </option>
          )
        })}
      </select>
      <input
        onChange={e => handleUpdate(e.currentTarget)}
        type="number"
        name="Width Input"
        id="width"
        placeholder="Width: 5 - 50"
        max={50}
        min={5}
      />
      <input
        onChange={e => handleUpdate(e.currentTarget)}
        type="number"
        name="Height Input"
        id="height"
        placeholder="Height: 5 - 50"
        max={50}
        min={5}
      />
      <span />
      <button
        className={styles.updateButton}
        id="reset"
        onClick={e => handleUpdate(e.currentTarget)}
      >
        Reset Board
      </button>
    </section>
  )
}

type OptionsProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
