import { Game } from '../types'
import { SavedData } from '../components/Completion'

export function findIndexFromSettings(data: SavedData, game: Game) {
  return data.settingsSpecificStats.findIndex(
    s =>
      s.boardSettings.difficulty === game.difficulty &&
      s.boardSettings.sizeOfBoard === game.dimensions.height * game.dimensions.width
  )
}
