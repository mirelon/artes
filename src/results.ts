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

export type Results = { [raw: string]: string[] }

export const initialResult = (word: Word) =>
  Array.from({length: word.phonemes.length}, () => '') // Initialize with empty strings

export const initialResults = (words: Word[]) =>
  Object.fromEntries(words.map(word => [word, initialResult(word)]))

export const totalConsonantsCount = (results: Results) => sum(Object.keys(results).map(consonantsCount))

export const totalVocalsCount = (results: Results) => sum(Object.keys(results).map(vocalsCount))

export const totalDiphthongsCount = (results: Results) => sum(Object.keys(results).map(diphthongsCount))

export const totalPhonemesCount = (results: Results) => sum(Object.keys(results).map(phonemesCount))

export const assertSameLength = (statuses: string[], word: Word) => {
  if (statuses.length != word.phonemes.length) throw new Error(`Result statuses length does not match the phoneme count for ${word.raw}: ${statuses.length} != ${word.phonemes.length}`)
}

export const correctConsonantsCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([phoneme, status]) => isConsonant(phoneme) && status === 'OK').length
}))

export const correctVocalsCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([phoneme, status]) => isVocal(phoneme) && status === 'OK').length
}))

export const correctPhonemesCount = (results: Results) => sum(Object.entries(results).map(([raw, statuses]) => {
  const word = toWord(raw)
  assertSameLength(statuses, word)
  return limitedZip(word.phonemes, statuses).filter(([_phoneme, status]) => status === 'OK').length
}))
