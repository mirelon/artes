import React, {useEffect, useState} from 'react'
import CharacterBox from './CharacterBox'

type WordDisplayProps = {
  word: string
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

  const handleCharacterUpdate = (index: number, status: string) => {
    const newResults = [...currentResults]
    newResults[index] = status
    updateResults(newResults)
  }

  const handleOKClick = () => {
    updateResults(Array.from({length: word.length}, () => 'OK'))
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
      <h2>{word}</h2>
      <div className="word-container" style={{gap: boxSize / 2}}>
        {word.split('').map((char, index) => (
          <CharacterBox
            key={`${word}-${index}`}
            character={char}
            status={currentResults?.[index]}
            onStatusUpdate={(status) => handleCharacterUpdate(index, status)}
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