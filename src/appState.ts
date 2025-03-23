import {Word} from './phonemes'
import {initialResults, Results} from './results'

export type ChildProfile = {
  results: Results
  birth?: Date
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
    currentChildId: newChildId,
  }

  localStorage.setItem('artesAppState', JSON.stringify(updatedAppState))
  return updatedAppState
}

export const initialAppState = (words: Word[]) => addChild({}, words)
