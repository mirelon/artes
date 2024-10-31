import React from 'react'
import {Results} from './results.ts'

interface ResultsDisplayProps {
  results: Results
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({results}) => {
  return (
    <div>
      <h2>Results</h2>
      {Object.entries(results).map(([word, statuses]) => (
        <div key={word}>
          <h3>{word}</h3>
          <p>{statuses.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

export default ResultsDisplay