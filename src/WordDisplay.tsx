import React, {useEffect, useState} from 'react'
import PhonemeBox from './PhonemeBox.tsx'
import {Word} from './phonemes.ts'

type WordDisplayProps = {
  word: Word
  results: string[]
  updateResultsInLocalStorage: (results: string[]) => void
  onNextWord: () => void
  boxSize: number
}

const WordDisplay: React.FC<WordDisplayProps> = ({word, results, updateResultsInLocalStorage, onNextWord: onNextWordOuter, boxSize}) => {
  const [currentResults, setCurrentResults] = useState<string[]>(results)
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(false)

  const onNextWord = () => {
    setNextButtonDisabled(false)
    onNextWordOuter()
  }

  // Sync currentResults with updated results whenever `results` changes (e.g., new word)
  useEffect(() => {
    setCurrentResults(results)
  }, [results])

  const updateResults = (newResults: string[]) => {
    setCurrentResults(newResults)
    updateResultsInLocalStorage(newResults)
  }

  const handlePhonemeUpdate = (index: number, status: string) => {
    const newResults = [...currentResults]
    newResults[index] = status
    updateResults(newResults)
  }

  const handleOKClick = () => {
    updateResults(Array.from({length: word.phonemes.length}, () => 'OK'))
    setNextButtonDisabled(true)
    setTimeout(onNextWord, 1000)
  }

  const handleContinueClick = () => {
    let somethingChanged = false
    updateResults(currentResults.map((result) => {
      if (result === '') {
        somethingChanged = true
        return 'OK'
      } else {
        return result
      }
    }))
    setNextButtonDisabled(true)
    setTimeout(onNextWord, somethingChanged ? 1000 : 0)
  }

  return (
    <div>
      <div className="word-container" style={{gap: boxSize / 2}}>
        {word.phonemes.map((phoneme, index) => (
          <PhonemeBox
            key={`${word.raw}-${index}`}
            phoneme={phoneme}
            status={currentResults?.[index]}
            onStatusUpdate={(status) => handlePhonemeUpdate(index, status)}
            boxSize={boxSize}
          />
        ))}
      </div>
      {currentResults?.some(result => result)
        ? <button onClick={handleContinueClick} disabled={nextButtonDisabled}>Continue</button>
        : <button onClick={handleOKClick} disabled={nextButtonDisabled}>OK</button>
      }
    </div>
  )
}

export default WordDisplay