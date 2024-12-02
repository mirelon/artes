import React from 'react'
import {
  correctConsonantsCount,
  correctPhonemesCount,
  correctVocalsCount,
  Results,
  totalConsonantsCount,
  totalPhonemesCount,
  totalVocalsCount
} from './results.ts'
import {formatPercentage} from './helpers.ts'

interface ResultsDisplayProps {
  results: Results
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({results}) => {
  return (
    <div className="results">
      <h2>Results</h2>
      <table>
        <thead>
        <tr>
          <th></th>
          <th>konzonantov (K.)</th>
          <th>vokálov (V)</th>
        </tr>
        </thead>
        <tr>
          <td>Suma cieľových (C.)</td>
          <td>{totalConsonantsCount(results)}</td>
          <td>{totalVocalsCount(results)}</td>
        </tr>
        <tr>
          <td>Suma správnych (S.)</td>
          <td>{correctConsonantsCount(results)}</td>
          <td>{correctVocalsCount(results)}</td>
        </tr>
        <thead>
        <tr>
          <th></th>
          <th colSpan={2}>konsonanty + vokály (K. + V.)</th>
        </tr>
        <tr>
          <td>Suma cieľových foném</td>
          <td colSpan={2}>{totalPhonemesCount(results)}</td>
        </tr>
        <tr>
          <td>Suma správnych foném</td>
          <td colSpan={2}>{correctPhonemesCount(results)}</td>
        </tr>
        </thead>
      </table>
      <span className="variable-label"
            title="Správne vyslovené konzonanty / cieľové konzonanty">SVK</span>: {totalConsonantsCount(results) > 0 ? formatPercentage(correctConsonantsCount(results) / totalConsonantsCount(results)) : '-'}
      <br/>
      <span className="variable-label"
            title="Správne vyslovené vokály / cieľové vokály">SVV</span>: {totalVocalsCount(results) > 0 ? formatPercentage(correctVocalsCount(results) / totalVocalsCount(results)) : '-'}
      <br/>
      <span className="variable-label"
            title="Správne vyslovené fonémy / cieľové fonémy">SVF</span>: {totalPhonemesCount(results) > 0 ? formatPercentage(correctPhonemesCount(results) / totalPhonemesCount(results)) : '-'}
      <br/>
      <h3>Detailné výsledky podľa slov:</h3>
      {Object.entries(results).map(([word, statuses]) => (
        <div key={word}>
          <span className="variable-label">{word}</span>
          <span>: {statuses.join(', ')}</span>
        </div>
      ))}
    </div>
  )
}

export default ResultsDisplay