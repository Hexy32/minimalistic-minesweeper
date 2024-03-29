export type Difficulty = 'easy' | 'medium' | 'hard' | 'master'
export type Action =
  | { type: 'set-difficulty'; payload: Difficulty }
  | {
    type: 'set-width' | 'set-height' | 'set-final-time'
    payload: number
  }
  | {
    type: 'set-started' | 'set-over' | 'set-has-won'
    payload: boolean
  }
  | {
    type: 'set-tiles'
    payload: Tile[]
  }
  | {
    type: 'regenerate-board'
  }
  | {
    type: 'show-toast'
    payload: Toast | undefined
  }
  | {
    type: 'set-style'
    payload: Style
  }

export type Style = 'default' | 'text' | 'blocks'

export type Tile = {
  cords: {
    x: number
    y: number
  }
  isBomb: boolean
  isFlagged: boolean
} & ({ isOpen: true; number: number } | { isOpen: false; number: undefined })

export type Game = {
  tiles: Tile[]
  started: boolean
  over: boolean
  hasWon: boolean
  finalTime: number
  difficulty: Difficulty
  style: Style
  currentToast?: Toast
  dimensions: {
    width: number
    height: number
  }
}

type Toast = {
  color: string
  message: string
  func?: () => void
}
