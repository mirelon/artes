import {sum} from 'lodash'

import {limitedZip} from './helpers.ts'
import {
  consonantsCount,
  diphthongsCount,
  isConsonant,
  isVocal,
  phonemesCount,
  toWord,
  vocalsCount,
  Word
} from './phonemes'

export enum PhonemeStatus {
  OK = 0,
  IMMATURE = 1,
  DISTORTED = 2,
  ABSENT = 3,
}

export type PhonemeResult = PhonemeStatus | string | null

export type Results = { [raw: string]: PhonemeResult[] }

export const initialResult = (word: Word) =>
  Array.from({length: word.phonemes.length}, () => null) // Initialize with nulls

export const initialResults = (words: Word[]) =>
  Object.fromEntries(words.map(word => [word.raw, initialResult(word)]))

export const totalConsonantsCount = (results: Results) => sum(Object.keys(results).map(consonantsCount))

export const totalVocalsCount = (results: Results) => sum(Object.keys(results).map(vocalsCount))

export const totalDiphthongsCount = (results: Results) => sum(Object.keys(results).map(diphthongsCount))

export const totalPhonemesCount = (results: Results) => sum(Object.keys(results).map(phonemesCount))

export const assertSameLength = (phonemeResults: PhonemeResult[], word: Word) => {
  if (phonemeResults.length != word.phonemes.length) throw new Error(`phonemeResults length does not match the phoneme count for ${word.raw}: ${phonemeResults.length} != ${word.phonemes.length}`)
}

export const correctConsonantsCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([phoneme, status]) => isConsonant(phoneme) && status === PhonemeStatus.OK).length
}))

export const correctVocalsCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([phoneme, status]) => isVocal(phoneme) && status === PhonemeStatus.OK).length
}))

const correctPhonemeStatuses: PhonemeResult[] = [PhonemeStatus.OK, PhonemeStatus.DISTORTED, PhonemeStatus.IMMATURE]

export const correctPhonemesCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([_phoneme, status]) => correctPhonemeStatuses.includes(status)).length
}))
