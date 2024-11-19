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
