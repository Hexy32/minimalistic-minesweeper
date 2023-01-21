import { Action, Difficulty, Game } from '../types'
import {
  getAverageTime,
  getBestTime,
  getBombsNotFlagged,
  getBombsPerSecond,
  getWinLoseRatio,
  shouldShowStat,
} from '../util/calculateStats'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { findIndexFromSettings } from '../util/other'
import styles from '../styles/completion.module.css'

const STORAGE_KEY = 'minesweeper_completion_stats'

export default function Completion({ game, dispatch }: CompletionProps) {
  const [savedData, setSavedData] = useState<SavedData>()

  const populateData = useMemo<SavedData>(() => {
    return {
      gamesPlayed: 1,
      gamesWon: game.hasWon ? 1 : 0,
      settingsSpecificStats: [
        {
          boardSettings: {
            sizeOfBoard: game.dimensions.width * game.dimensions.height,
            difficulty: game.difficulty,
          },
          allTimesWonInSeconds: game.hasWon ? [game.finalTime] : [],
          gamesPlayed: 1,
        },
      ],
    }
  }, [
    game.hasWon,
    game.dimensions.width,
    game.dimensions.height,
    game.difficulty,
    game.hasWon,
    game.finalTime,
  ])

  const updateData = useCallback(
    (data: SavedData) => {
      const indexOfCurrentSettings = findIndexFromSettings(data, game)

      //Update the primitive data
      const updatedData: SavedData = {
        gamesPlayed: data.gamesPlayed + 1,
        gamesWon: game.hasWon ? data.gamesWon + 1 : data.gamesWon,
        settingsSpecificStats: data.settingsSpecificStats,
      }

      if (!updatedData.settingsSpecificStats[indexOfCurrentSettings]) {
        //Create a object for the current game settings if one doesn't already exist
        updatedData.settingsSpecificStats.push({
          allTimesWonInSeconds: game.hasWon ? [game.finalTime] : [],
          gamesPlayed: 1,
          boardSettings: {
            sizeOfBoard: game.dimensions.width * game.dimensions.height,
            difficulty: game.difficulty,
          },
        })
      } else {
        //Update already exiting object
        updatedData.settingsSpecificStats[indexOfCurrentSettings].gamesPlayed++
        game.hasWon &&
          updatedData.settingsSpecificStats[indexOfCurrentSettings].allTimesWonInSeconds.push(
            game.finalTime
          )
      }
      return updatedData
    },
    [
      game.hasWon,
      game.dimensions.width,
      game.dimensions.height,
      game.difficulty,
      game.hasWon,
      game.finalTime,
    ]
  )

  useEffect(() => {
    const rawData = window.localStorage.getItem(STORAGE_KEY)
    const data: SavedData = rawData !== null ? JSON.parse(rawData) : null

    if (game.finalTime === -1) return

    if (!data) {
      const newData = populateData

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      setSavedData(newData)
    } else {
      const updatedData = updateData(data)

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
      setSavedData(updatedData)
    }
  }, [game.finalTime])

  const currentSettingsStats =
    savedData && savedData.settingsSpecificStats[findIndexFromSettings(savedData, game)]

  function addSuffix(content: string | number | null, suffix: string, backup: string) {
    if (content) {
      return content + suffix
    } else {
      return backup
    }
  }

  const statsSections: StatSections = [
    {
      sectionTitle: 'This Game:',
      data: [
        {
          label: 'Time taken',
          data: game.finalTime + 's',
          show: 'both',
        },
        { label: 'Bombs not flagged', data: getBombsNotFlagged(game), show: 'over' },
        { label: 'Bombs per second', data: getBombsPerSecond(game), show: 'won' },
      ],
    },
    {
      sectionTitle: 'With current settings:',
      data: !savedData
        ? []
        : [
            {
              label: 'Best time',
              data: currentSettingsStats
                ? addSuffix(getBestTime(currentSettingsStats), 's', '...')
                : '...',
              show: 'both',
            },
            {
              label: 'Average time taken',
              data: currentSettingsStats
                ? addSuffix(getAverageTime(currentSettingsStats), 's', '...')
                : '...',
              show: 'both',
            },
            {
              label: 'Games played',
              data: currentSettingsStats?.gamesPlayed || 0,
              show: 'both',
            },
            {
              label: 'Games won',
              data: currentSettingsStats?.allTimesWonInSeconds.length || 0,
              show: 'both',
            },
          ],
    },
    {
      sectionTitle: 'Your all-time:',
      data: [
        {
          label: 'Games played',
          data: savedData?.gamesPlayed || 0,
          show: 'both',
        },
        {
          label: 'Games won',
          data: savedData?.gamesWon || 0,
          show: 'both',
        },
        {
          label: 'Win/lose ratio',
          data: savedData ? addSuffix(getWinLoseRatio(savedData), '%', '...') : '...',
          show: 'both',
        },
      ],
    },
  ]

  return (
    <section className={styles.container}>
      <h2 className={game.hasWon ? styles.textWon : styles.textLost}>
        {game.hasWon ? 'You Won!' : 'Game Over'}
      </h2>
      {statsSections.map(section => (
        <div className={styles.section} key={section.sectionTitle}>
          <h3 className={styles.sectionTitle}>{section.sectionTitle}</h3>
          <ul className={styles.list}>
            {section.data.map((stat, i) => {
              if (shouldShowStat(stat, game)) {
                return (
                  <ul key={i} className={styles.stats}>
                    <span className={styles.label}>{stat.label}:</span>
                    <span className={styles.data}>{stat.data}</span>
                  </ul>
                )
              }
            })}
          </ul>
        </div>
      ))}
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

export type Stat = { label: string; data: string | number; show: 'won' | 'over' | 'both' }

type StatSections = {
  sectionTitle: string
  data: Stat[]
}[]

export type SavedData = {
  gamesPlayed: number
  gamesWon: number
  settingsSpecificStats: SettingsSpecificStats[]
}

export type SettingsSpecificStats = {
  boardSettings: {
    sizeOfBoard: number
    difficulty: Difficulty
  }
  allTimesWonInSeconds: number[]
  gamesPlayed: number
}

type CompletionProps = {
  game: Game
  dispatch: React.Dispatch<Action>
}
