import React, {useCallback, useEffect, useState} from 'react'
import './App.css'
import {useSwipeable} from 'react-swipeable'

import {AppState, initialAppState} from './appState.ts'
import {fetchWordList} from './helpers.ts'
import {Word} from './phonemes.ts'
import {initialResult, PhonemeResult} from './results.ts'
import ResultsDisplay from './ResultsDisplay.tsx'
import WordDisplay from './WordDisplay.tsx'

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([])
  const [isLoadingWords, setIsLoadingWords] = useState(true)
  const [errorLoadingWords, setErrorLoadingWords] = useState<string | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [maxWordLength, setMaxWordLength] = useState(1)
  const [appState, setAppState] = useState<AppState | null>(null)
  const [showResults, setShowResults] = useState(false)

  const cycleNextWord = useCallback(() => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length)
  }, [words.length])

  const cyclePreviousWord = useCallback(() => {
    setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length)
  }, [words.length])

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      cycleNextWord()
    } else {
      setShowResults(true)
    }
  }

  // Fetch the words on initial load
  useEffect(() => {
    const loadWords = async () => {
      try {
        const loadedWords = await fetchWordList()
        setWords(loadedWords)
        setMaxWordLength(Math.max(...loadedWords.map((word) => word.phonemes.length)))
      } catch (e: unknown) {
        if (e instanceof Error) setErrorLoadingWords(`When loading words: ${e.message}`)
        else setErrorLoadingWords(`When loading words: ${JSON.stringify(e)}`)
      } finally {
        setIsLoadingWords(false)
      }
    }
    loadWords()
  }, [])

  useEffect(() => {
    const storedState = localStorage.getItem('artesAppState')
    if (storedState) {
      try {
        return setAppState(JSON.parse(storedState))
      } catch { /* Continue with initialization of app state */ }
    }
    const appState = initialAppState(words)
    setAppState(appState)
    localStorage.setItem('artesAppState', JSON.stringify(appState))
  }, [words])

  // Handle arrow keys and Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        cycleNextWord()
      } else if (event.key === 'ArrowLeft') {
        cyclePreviousWord()
      } else if (event.key === 'Escape') {
        setShowResults((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cycleNextWord, cyclePreviousWord])

  // Calculate box size and gap dynamically based on screen width and word length
  const currentWord = words[currentWordIndex] || []
  const boxSize = 0.6 * window.innerWidth / maxWordLength

  const updateResultsInLocalStorage = (appState: AppState, word: Word) => (wordResults: PhonemeResult[]) => {
    const {children, currentChildId} = appState
    const childProfile = children[currentChildId]!
    const results = childProfile.results
    const newResults = {...results, [word.raw]: wordResults}
    const newAppState: AppState = {
      ...appState,
      children: {...children, [currentChildId]: {...childProfile, results: newResults}},
    }
    setAppState(newAppState)
    localStorage.setItem('artesAppState', JSON.stringify(newAppState))
  }

  const handlers = useSwipeable({
    onSwipedLeft: cycleNextWord,
    onSwipedRight: cyclePreviousWord,
    preventScrollOnSwipe: true,
  })

  return (
    <div {...handlers} className="container">
      {isLoadingWords ? (
        <div>Loading words...</div>
      ) : errorLoadingWords ? (
        <div>Error: {errorLoadingWords}</div>
      ) : !appState ? (
        <div>Words are loaded, but App is not initialized</div>
      ) : (
        (() => {
          const child = appState.children[appState.currentChildId]
          if (!child) return <div>No child selected</div>

          const childResults = child.results ?? {}
          return showResults ? (
            <ResultsDisplay results={childResults} />
          ) : (
            <WordDisplay
              word={currentWord}
              results={childResults[currentWord.raw] ?? initialResult(currentWord)}
              updateResultsInLocalStorage={updateResultsInLocalStorage(appState, currentWord)}
              onNextWord={handleNextWord}
              boxSize={boxSize}
            />
          )
        })()
      )}
    </div>
  )
}

export default App
