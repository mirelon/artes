import React, {useEffect, useState} from 'react'
import './App.css'

// Load words from words.txt file in the public folder
const fetchWordList = async () => {
  const response = await fetch('words.txt')
  const text = await response.text()
  return text.split('\n').map((word) => word.trim()).filter(Boolean)
}

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [maxWordLength, setMaxWordLength] = useState(1)

  // Fetch the words on initial load
  useEffect(() => {
    const loadWords = async () => {
      const loadedWords = await fetchWordList()
      setWords(loadedWords)
      setMaxWordLength(Math.max(...loadedWords.map((word) => word.length)))
    }
    loadWords()
  }, [])

  // Change the current word based on arrow key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else if (event.key === 'ArrowLeft') {
        setCurrentWordIndex((prev) => (prev - 1 + words.length) % words.length);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [words.length])

  // Calculate box size and gap dynamically based on screen width and word length
  const currentWord = words[currentWordIndex] || ''
  const boxSize = 0.6 * window.innerWidth / maxWordLength
  const dynamicGap = boxSize / 2

  return (
    <div className="container">
      <div className="word-container" style={{gap: dynamicGap}}>
        {currentWord.split('').map((char, index) => (
          <div
            key={index}
            className="char-box"
            style={{
              width: boxSize,
              height: boxSize,
              borderRadius: `${boxSize / 10}px`
            }} // Adjust border radius based on box size
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
