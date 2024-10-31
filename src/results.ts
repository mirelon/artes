export type Results = { [word: string]: string[] }

export const initialResult = (word: string) =>
  Array.from({length: word.length}, () => '') // Initialize with empty strings

export const initialResults = (words: string[]) =>
  Object.fromEntries(words.map(word => [word, initialResult(word)]))