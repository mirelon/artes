import {isNumber} from "lodash";

import {limitedZip} from './helpers.ts'
import {isConsonant, isDiphthong, isVocal, Phoneme, toWord} from './phonemes.ts'
import {assertSameLength, Results} from './results.ts'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const positions = ['I', 'M', 'F']

export type Position = (typeof positions)[number]

type ResultsPerPosition = Record<Position, { correct: number, tested: number }>

type ResultsPerPhonemePosition = Record<Phoneme, ResultsPerPosition>

type ResultsPerPhoneme = Record<Phoneme, Record<string, number>>

const calculateResultsPerPhonemePosition = (results: Results) => {
  const resultsPerPhonemePosition: ResultsPerPhonemePosition = {}
  Object.entries(results).forEach(([raw, statuses]) => {
    const word = toWord(raw)
    assertSameLength(statuses, word)
    limitedZip(word.phonemes, statuses).forEach(([phoneme, status], index) => {
      const position = index === 0 ? 'I' : index === statuses.length ? 'F' : 'M'
      if (!resultsPerPhonemePosition[phoneme]) resultsPerPhonemePosition[phoneme] = {}
      if (!resultsPerPhonemePosition[phoneme][position]) resultsPerPhonemePosition[phoneme][position] = {
        correct: 0,
        tested: 0
      }
      resultsPerPhonemePosition[phoneme][position].correct += status === 'OK' ? 1 : 0
      resultsPerPhonemePosition[phoneme][position].tested += 1
    })
  })
  return resultsPerPhonemePosition
}


const calculateStatusResultsPerPhoneme = (results: Results) => {
  const resultsPerPhoneme: ResultsPerPhoneme = {}
  Object.entries(results).forEach(([raw, statuses]) => {
    const word = toWord(raw)
    assertSameLength(statuses, word)
    limitedZip(word.phonemes, statuses).forEach(([phoneme, status]) => {
      if (!resultsPerPhoneme[phoneme]) resultsPerPhoneme[phoneme] = {
        OK: 0,
        NZ: 0,
        D: 0,
        A: 0,
        all: 0
      }
      if (!isNumber(resultsPerPhoneme[phoneme][status])) {
        throw new Error(`Invalid status: ${status}`)
      }
      resultsPerPhoneme[phoneme][status] += 1
      resultsPerPhoneme[phoneme].all += 1
    })
  })
  return resultsPerPhoneme
}

const isCorrectOnPositions = (resultsPerPosition: ResultsPerPosition, positions: Position[]) =>
  positions.every(position => resultsPerPosition[position] && resultsPerPosition[position].correct > 0)

const allPhonemePositionsFactory = (results: Results) => (phoneme: Phoneme) => {
  const positions: Set<Position> = new Set()
  Object.entries(results).forEach(([raw]) => {
    const word = toWord(raw)
    word.phonemes.forEach((phoneme2, index) => {
      if (phoneme2 !== phoneme) return
      const position = index === 0 ? 'I' : index === word.phonemes.length ? 'F' : 'M'
      positions.add(position)
    })
  })
  return positions
}

export const consonantsCorrectInAllPositionsCount = (results: Results) => {
  const resultsPerPhonemePosition = calculateResultsPerPhonemePosition(results)
  const allPhonemePositions = allPhonemePositionsFactory(results)
  return Object.entries(resultsPerPhonemePosition)
    .filter(([phoneme, resultsPerPosition]) => isConsonant(phoneme) && isCorrectOnPositions(resultsPerPosition, [...allPhonemePositions(phoneme)]))
    .length
}

export const nonConstantConsonantsCount = (results: Results) => {
  const resultsPerPhoneme = calculateStatusResultsPerPhoneme(results)
  return Object.entries(resultsPerPhoneme).filter(
    ([phoneme, statusesWithCount]) =>
      isConsonant(phoneme) && statusesWithCount.OK > 0 && statusesWithCount.OK < statusesWithCount.all
  ).length
}

export const consonantsWithStatus = (results: Results, status: string) => {
  const resultsPerPhoneme = calculateStatusResultsPerPhoneme(results)
  return Object.entries(resultsPerPhoneme).filter(
    ([phoneme, statusesWithCount]) =>
      isConsonant(phoneme) && statusesWithCount[status] > 0
  ).map(([phoneme]) => phoneme)
}
export const consonantsWithStatusCount = (results: Results, status: string) => consonantsWithStatus(results, status).length

export const vocalsWithStatusCount = (results: Results, status: string) => {
  const resultsPerPhoneme = calculateStatusResultsPerPhoneme(results)
  return Object.entries(resultsPerPhoneme).filter(
    ([phoneme, statusesWithCount]) =>
      isVocal(phoneme) && statusesWithCount[status] > 0
  ).length
}

export const diphthongsWithStatusCount = (results: Results, status: string) => {
  const resultsPerPhoneme = calculateStatusResultsPerPhoneme(results)
  return Object.entries(resultsPerPhoneme).filter(
    ([phoneme, statusesWithCount]) =>
      isDiphthong(phoneme) && statusesWithCount[status] > 0
  ).length
}