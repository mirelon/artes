import React from 'react'
import {Phoneme} from "./phonemes.ts";

type PhonemeBoxProps = {
  phoneme: Phoneme
  status: string
  onStatusUpdate: (status: string) => void
  boxSize: number
}

const PhonemeBox: React.FC<PhonemeBoxProps> = ({phoneme, status, onStatusUpdate, boxSize}) => {
  const getColor = (status: string) => {
    switch (status) {
      case "OK":
        return {background: "#28a745", buttonColor: "#b8e5b3"}
      case "NZ":
        return {background: "#ffc107", buttonColor: "#ffe5a1"}
      case "D":
        return {background: "#fd7e14", buttonColor: "#f9c6a1"}
      case "A":
        return {background: "#6c757d", buttonColor: "#d6d8db"}
      default:
        return {background: "#d4edda", buttonColor: "#d4edda"}
    }
  }

  const colors = getColor(status)

  return (
    <div className="char-box-container">
      <div className="char-box" style={{
        backgroundColor: colors.background,
        width: boxSize,
        height: boxSize,
        borderRadius: `${boxSize / 10}px`
      }}>
        {phoneme}
      </div>
      <div className="status-buttons">
        {['NZ', 'D', 'A'].map((label) => (
          <button
            key={label}
            onClick={() => onStatusUpdate(label)}
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