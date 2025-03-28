import {Word} from './phonemes'
import {initialResults, Results} from './results'

export type ChildProfile = {
  results: Results
  birth?: string // Stored as "DD.MM.YYYY"
  gender?: 'M' | 'F'
  name?: string
}

export type AppState = {
  children: Record<string, ChildProfile> // Using a unique ID as the key
  currentChildId: string // ID of the currently selected child
}

export const addChild = (children: Record<string, ChildProfile>, words: Word[]): AppState => {
  const newChildId = crypto.randomUUID()
  const newChild: ChildProfile = {
    results: initialResults(words),
  }

  const updatedChildren = { ...children, [newChildId]: newChild }
  const updatedAppState: AppState = {
    children: updatedChildren,
    currentChildId: newChildId
  }

  localStorage.setItem('artesAppState', JSON.stringify(updatedAppState))
  return updatedAppState
}

export const initialAppState = (words: Word[]) => addChild({}, words)

export const displayGender = (gender?: 'M' | 'F') => gender && { M: '♂', F: '♀' }[gender]

export const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split('.').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null

  const [day, month, year] = parts
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

export const isValidDate = (dateStr: string): boolean => parseDate(dateStr) !== null
