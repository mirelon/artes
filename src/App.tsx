import React, {useEffect, useState} from 'react'
import './App.css'
import {initialResult, initialResults, Results} from './results.ts'
import WordDisplay from './WordDisplay.tsx'
import ResultsDisplay from './ResultsDisplay.tsx'

// Load words from words.txt file in the public folder
const fetchWordList = async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}/words.txt`)
  const text = await response.text()
  return text.split('\n').map((word) => word.trim()).filter(Boolean)
}

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [maxWordLength, setMaxWordLength] = useState(1)
  const [results, setResults] = useState<Results>({})
  const [showResults, setShowResults] = useState(false)

  // Fetch the words on initial load
  useEffect(() => {
    const loadWords = async () => {
      const loadedWords = await fetchWordList()
      setWords(loadedWords)
      setMaxWordLength(Math.max(...loadedWords.map((word) => word.length)))
    }
    loadWords()
  }, [])

  useEffect(() => {
    try {
      setResults(JSON.parse(localStorage.getItem('speechResults') ?? ''))
    } catch {
      setResults(initialResults(words))
      localStorage.setItem('speechResults', JSON.stringify(initialResults))
    }
  }, [words])

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  // Change the current word based on arrow key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else if (event.key === 'ArrowLeft') {
        setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [words.length])

  // Calculate box size and gap dynamically based on screen width and word length
  const currentWord = words[currentWordIndex] || ''
  const boxSize = 0.6 * window.innerWidth / maxWordLength

  const updateResultsInLocalStorage = (word: string) => (wordResults: string[]) => {
    const newResults = {...results, [word]: wordResults}
    setResults(newResults)
    localStorage.setItem('speechResults', JSON.stringify(newResults))
  }

  return (
    <div className="container">
      {showResults ? (
        <ResultsDisplay results={results}/>
      ) : (
        <WordDisplay
          word={currentWord}
          results={results[currentWord] ?? initialResult(currentWord)}
          updateResultsInLocalStorage={updateResultsInLocalStorage(currentWord)}
          onNextWord={handleNextWord}
          boxSize={boxSize}
        />
      )}
    </div>
  )
}

export default App
