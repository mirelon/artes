import React, {useRef, useState} from 'react'

import {Phoneme} from './phonemes.ts'
import {isChangedAndIncorrect, PhonemeResult, PhonemeStatus} from './results.ts'


type PhonemeBoxProps = {
  phoneme: Phoneme
  phonemeResult: PhonemeResult
  onResultUpdate: (phonemeResult: PhonemeResult) => void
  boxSize: number
}

const phonemeStatusButtonLabels: [PhonemeStatus, string][] = [
  [PhonemeStatus.IMMATURE, 'NZ'],
  [PhonemeStatus.DISTORTED, 'D'],
  [PhonemeStatus.ABSENT, 'A'],
]

const getColor = (phonemeResult: PhonemeResult) => {
  if (phonemeResult === PhonemeStatus.OK) return {background: "#28a745", buttonColor: "#b8e5b3"}
  if (phonemeResult === PhonemeStatus.IMMATURE || (typeof phonemeResult === 'string' && phonemeResult.endsWith(PhonemeStatus.IMMATURE.toString()))) return {background: "#ffc107", buttonColor: "#ffe5a1"}
  if (phonemeResult === PhonemeStatus.DISTORTED || (typeof phonemeResult === 'string' && phonemeResult.endsWith(PhonemeStatus.DISTORTED.toString()))) return {background: "#fd7e14", buttonColor: "#f9c6a1"}
  if (phonemeResult === PhonemeStatus.ABSENT) return {background: "#6c757d", buttonColor: "#d6d8db"}
  if (phonemeResult == null) return {background: "#d4edda", buttonColor: "#d4edda"}
  return {background: "#ba68c8", buttonColor: "#e1bee7"}
}

const PhonemeBox: React.FC<PhonemeBoxProps> = ({phoneme, phonemeResult, onResultUpdate, boxSize}) => {

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayedPhoneme = typeof phonemeResult === 'string'
    ? isChangedAndIncorrect(phonemeResult)
      ? phonemeResult.slice(0, -1)
      : phonemeResult
    : phoneme

  const handleBoxClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 0) // Focus the input after rendering
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase() // Convert to uppercase
    if (/^[A-ZÁÄČĎÉÍĽŇÓÔŔŠŤÚÝŽ]*$/.test(value)) {
      onResultUpdate(value) // Allow only alphabet characters, including Slovak ones
    }
  }

  const handleBlur = () => {
    if (inputRef.current?.value === '') {
      inputRef.current.value = phoneme
      onResultUpdate(PhonemeStatus.ABSENT)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleBlur()
  }

  const colors = getColor(phonemeResult)

  return (
    <div className="phoneme-box-container">
      <div className="phoneme-box" style={{
        backgroundColor: colors.background,
        width: boxSize,
        height: boxSize,
        borderRadius: `${boxSize / 10}px`
      }} onClick={handleBoxClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={displayedPhoneme}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="phoneme-input"
          />
        ) : (
          displayedPhoneme
        )}
      </div>
      <div className="phoneme-status-buttons">
        {phonemeStatusButtonLabels.map(([phonemeStatus, label]) => (
          <button
            key={label}
            onClick={() => phonemeResult === phonemeStatus
              ? onResultUpdate(null) // Remove status for unchanged phoneme
              : typeof phonemeResult === 'string' && phonemeResult.length > 0 && [PhonemeStatus.DISTORTED, PhonemeStatus.IMMATURE].includes(phonemeStatus)
                ? [PhonemeStatus.DISTORTED, PhonemeStatus.IMMATURE].map(s => s.toString()).includes(phonemeResult.slice(-1))
                  ? phonemeResult[-1] === phonemeStatus.toString()
                    ? onResultUpdate(phonemeResult.slice(0, -1)) // Remove status from changed phoneme
                    : onResultUpdate(`${phonemeResult.slice(0, -1)}${phonemeStatus}`) // Change status of changed phoneme
                  : onResultUpdate(`${phonemeResult}${phonemeStatus}`) // Add status for changed phoneme
                : onResultUpdate(phonemeStatus)} // Change status for unchanged phoneme
            style={{
              backgroundColor: colors.buttonColor,
              width: boxSize,
              margin: '4px 0' // Adds spacing between buttons
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PhonemeBox
