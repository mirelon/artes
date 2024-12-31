import React, {useCallback, useEffect, useState} from 'react'
import './App.css'
import {useSwipeable} from 'react-swipeable'

import {fetchWordList} from './helpers.ts'
import {Word} from './phonemes.ts'
import {initialResult, initialResults, PhonemeResult, Results} from './results.ts'
import ResultsDisplay from './ResultsDisplay.tsx'
import WordDisplay from './WordDisplay.tsx'

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([])
  const [isLoadingWords, setIsLoadingWords] = useState(true)
  const [errorLoadingWords, setErrorLoadingWords] = useState<string | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [maxWordLength, setMaxWordLength] = useState(1)
  const [results, setResults] = useState<Results>({})
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
    try {
      setResults(JSON.parse(localStorage.getItem('speechResults') ?? '{}'))
    } catch {
      setResults(initialResults(words))
      localStorage.setItem('speechResults', JSON.stringify(initialResults))
    }
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

  const updateResultsInLocalStorage = (word: Word) => (wordResults: PhonemeResult[]) => {
    const newResults = {...results, [word.raw]: wordResults}
    setResults(newResults)
    localStorage.setItem('speechResults', JSON.stringify(newResults))
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
      ) : showResults ? (
        <ResultsDisplay results={results}/>
      ) : (
        <WordDisplay
          word={currentWord}
          results={results[currentWord.raw] ?? initialResult(currentWord)}
          updateResultsInLocalStorage={updateResultsInLocalStorage(currentWord)}
          onNextWord={handleNextWord}
          boxSize={boxSize}
        />
      )}
    </div>
  )
}

export default App
