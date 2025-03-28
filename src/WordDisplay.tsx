import React, {useCallback, useEffect, useState} from 'react'
import {useSwipeable} from "react-swipeable";

import {AppState, ChildProfile} from './appState.ts';
import PhonemeBox from './PhonemeBox.tsx'
import {Word} from './phonemes.ts'
import {initialResult, PhonemeResult, PhonemeStatus} from './results.ts'

type WordDisplayProps = {
  words: Word[]
  appState: AppState
  updateChild: (updates: Partial<ChildProfile>) => void
  boxSize: number
  setCurrentPage: (currentPage: 'wordDisplay' | 'childDisplay') => void
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  words,
  appState,
  updateChild,
  boxSize,
  setCurrentPage
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const currentWord = words[currentWordIndex] || []
  const results = (appState.children[appState.currentChildId]!.results ?? {})[currentWord.raw] ?? initialResult(currentWord)
  const [currentResults, setCurrentResults] = useState<PhonemeResult[]>(results)
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(false)


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
      setCurrentPage('childDisplay')
    }
  }

  // Handle arrow keys and Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        cycleNextWord()
      } else if (event.key === 'ArrowLeft') {
        cyclePreviousWord()
      } else if (event.key === 'Escape') {
        setCurrentPage('childDisplay')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cycleNextWord, cyclePreviousWord, setCurrentPage])

  const onNextWord = () => {
    setNextButtonDisabled(false)
    handleNextWord()
  }

  // Sync currentResults with updated results whenever `results` changes (e.g., new word)
  useEffect(() => {
    setCurrentResults(results)
  }, [results])

  const updateResultsInLocalStorage = (wordResults: PhonemeResult[]) => {
    const childProfile = appState.children[appState.currentChildId]!
    updateChild({results: {...(childProfile.results), [currentWord.raw]: wordResults}})
  }

  const updateResults = (newResults: PhonemeResult[]) => {
    setCurrentResults(newResults)
    updateResultsInLocalStorage(newResults)
  }

  const handlePhonemeUpdate = (index: number, phonemeResult: PhonemeResult) => {
    const newResults = [...currentResults]
    newResults[index] = phonemeResult
    updateResults(newResults)
  }

  const handleOKClick = () => {
    updateResults(Array.from({length: currentWord.phonemes.length}, () => PhonemeStatus.OK))
    setNextButtonDisabled(true)
    setTimeout(onNextWord, 1000)
  }

  const handleContinueClick = () => {
    let somethingChanged = false
    updateResults(currentResults.map((result) => {
      if (result === null) {
        somethingChanged = true
        return PhonemeStatus.OK
      } else {
        return result
      }
    }))
    setNextButtonDisabled(true)
    setTimeout(onNextWord, somethingChanged ? 1000 : 0)
  }

  const handlers = useSwipeable({
    onSwipedLeft: cycleNextWord,
    onSwipedRight: cyclePreviousWord,
    preventScrollOnSwipe: true,
  })

  return (
    <div {...handlers}>
      <div className="word-container" style={{gap: boxSize / 2}}>
        {currentWord.phonemes.map((phoneme, index) => (
          <PhonemeBox
            key={`${currentWord.raw}-${index}`}
            phoneme={phoneme}
            phonemeResult={currentResults?.[index]}
            onResultUpdate={(phonemeResult) => handlePhonemeUpdate(index, phonemeResult)}
            boxSize={boxSize}
          />
        ))}
      </div>
      <div className="button-container">
        {currentResults?.some(result => result)
          ? <button onClick={handleContinueClick} disabled={nextButtonDisabled}>Continue</button>
          : <button onClick={handleOKClick} disabled={nextButtonDisabled}>OK</button>
        }
      </div>
    </div>
  )
}

export default WordDisplay
