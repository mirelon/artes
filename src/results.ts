import {Word} from './phonemes'

export type Results = { [raw: string]: string[] }

export const initialResult = (word: Word) =>
  Array.from({length: word.phonemes.length}, () => '') // Initialize with empty strings

export const initialResults = (words: Word[]) =>
  Object.fromEntries(words.map(word => [word, initialResult(word)]))