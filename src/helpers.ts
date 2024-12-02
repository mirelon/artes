import {zip} from 'lodash'
import {toWord, Word} from './phonemes.ts'

// Load words from words.txt file in the public folder
export const fetchWordList = async (): Promise<Word[]> => {
  const response = await fetch(`${import.meta.env.BASE_URL}/words.txt`)

  // Check for non-200 status
  if (!response.ok) {
    throw new Error(`Failed to fetch words.txt: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('Content-Type') || ''

  // Ensure the response is plain text
  if (!contentType.includes('text/plain')) {
    throw new Error(`Unexpected content type: ${contentType}`)
  }

  const text = await response.text()
  return text.split('\n').map((word) => word.trim()).filter(Boolean).map(toWord)
}

/**
 * Lodash's zip returns optional types because array can have different lengths.
 * This implementation takes minimum of the lengths of arrays and the items have non-optional types.
 */
export const limitedZip = <T, U>(arr1: T[], arr2: U[]): [T, U][] =>
  zip(arr1, arr2).filter(([t, u]) => t !== undefined && u !== undefined) as [T, U][]

export const formatPercentage = (number: number) => `${(100 * number).toFixed(2)}%`