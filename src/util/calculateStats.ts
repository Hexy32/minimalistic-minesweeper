import { SavedData, SettingsSpecificStats } from './../components/Completion'

import { Game } from './../types.d'
import { Stat } from '../components/Completion'
import { getNumberOfBombs } from './generateBombs'

export function shouldShowStat(stat: Stat, game: Game) {
  if (stat.show === 'both') {
    return true
  }
  if (stat.show === 'won' && game.hasWon) {
    return true
  }
  if (stat.show === 'over' && !game.hasWon) {
    return true
  }
  return false
}

export function getBombsNotFlagged(game: Game) {
  let x = 0
  game.tiles.forEach(tile => {
    if (tile.isBomb && !tile.isFlagged) x++
  })
  return x
}

export function getBombsPerSecond(game: Game) {
  const numberOfBombs = getNumberOfBombs(
    game.difficulty,
    game.dimensions.width * game.dimensions.height
  )

  const bombsPerSecond = game.finalTime ? numberOfBombs / game.finalTime : numberOfBombs

  return Math.round(bombsPerSecond * 100) / 100
}

export function getBestTime(currentSettingsStats: SettingsSpecificStats) {
  if (currentSettingsStats.allTimesWonInSeconds.length === 0) return null
  return Math.min(...currentSettingsStats.allTimesWonInSeconds)
}

export function getAverageTime(currentSettingsStats: SettingsSpecificStats) {
  if (currentSettingsStats.allTimesWonInSeconds.length === 0) return null

  const averageTime =
    currentSettingsStats.allTimesWonInSeconds.reduce((a, b) => a + b) /
    currentSettingsStats.allTimesWonInSeconds.length
  return Math.round(averageTime * 100) / 100
}

export function getWinLoseRatio(data: SavedData) {
  if (!data.gamesPlayed) return null

  const ratio = data.gamesWon / data.gamesPlayed
  return Math.round(ratio * 100)
}
