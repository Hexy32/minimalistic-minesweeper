import styles from '../styles/options.module.css'

export default function Options({
  difficulty,
  setDifficulty,
  setWidth,
  setHeight,
  updateBoard,
}: OptionsProps) {
  let inputLock = false
  function handleUpdate(currentTarget: HTMLElement) {
    const buttonColor = document.documentElement.style.getPropertyValue('main-color')
    toggleInputs(false)

    const inputs = currentTarget.parentElement?.children!

    const difficulty = (inputs[0] as HTMLSelectElement).value

    let width = parseInt((inputs[1] as HTMLInputElement).value)
    let height = parseInt((inputs[2] as HTMLInputElement).value)

    function toggleInputs(lockOrUnlock: boolean) {
      if (lockOrUnlock) {
        currentTarget.style.backgroundColor = '#f15252'
        inputLock = true
      } else {
        currentTarget.style.backgroundColor = buttonColor
        inputLock = false
      }
    }

    if (width > 50 || height > 50 || width <= 4 || height <= 4) {
      toggleInputs(true)
      return
    }

    setDifficulty(difficulty)

    if (!isNaN(width)) setWidth(width)
    if (!isNaN(height)) setHeight(height)
  }

  const difficulties = ['Easy', 'Medium', 'Hard', 'Master']

  return (
    <section className={styles.options}>
      <select
        onChange={e => handleUpdate(e.currentTarget)}
        name="Difficulty"
        defaultValue={difficulty}
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
        placeholder="Width: 5 - 50"
        max={50}
        min={5}
      />
      <input
        onChange={e => handleUpdate(e.currentTarget)}
        type="number"
        name="Height Input"
        placeholder="Height: 5 - 50"
        max={50}
        min={5}
      />
      <span />
      <button
        className={styles.updateButton}
        onClick={() => {
          updateBoard()
        }}
      >
        Reset Board
      </button>
    </section>
  )
}

interface OptionsProps {
  difficulty: string
  setDifficulty: (value: React.SetStateAction<string>) => void
  setWidth: (value: React.SetStateAction<number>) => void
  setHeight: (value: React.SetStateAction<number>) => void
  updateBoard: () => void
}
