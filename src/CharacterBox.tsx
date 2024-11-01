import React from 'react'

type CharacterBoxProps = {
  character: string
  status: string
  onStatusUpdate: (status: string) => void
  boxSize: number
}

const CharacterBox: React.FC<CharacterBoxProps> = ({character, status, onStatusUpdate, boxSize}) => {
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
    <div>
      <div className="char-box" style={{
        backgroundColor: colors.background,
        width: boxSize,
        height: boxSize,
        borderRadius: `${boxSize / 10}px`
      }}>
        {character}
      </div>
      <div>
        {['NZ', 'D', 'A'].map((label) => (
          <button
            key={label}
            onClick={() => onStatusUpdate(label)}
            style={{backgroundColor: colors.buttonColor}}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CharacterBox