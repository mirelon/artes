import React from 'react'

import {formatPercentage} from './helpers.ts'
import {
  consonantsCorrectInAllPositionsCount,
  consonantsWithStatus,
  consonantsWithStatusCount,
  diphthongsWithStatusCount,
  nonConstantConsonantsCount,
  vocalsWithStatusCount
} from './positions.ts'
import {
  correctConsonantsCount,
  correctPhonemesCount,
  correctVocalsCount,
  PhonemeStatus,
  Results,
  totalConsonantsCount,
  totalDiphthongsCount,
  totalPhonemesCount,
  totalVocalsCount
} from './results.ts'

const phonemeStatusLabels = {
  [PhonemeStatus.OK]: 'OK',
  [PhonemeStatus.IMMATURE]: 'NZ',
  [PhonemeStatus.DISTORTED]: 'D',
  [PhonemeStatus.ABSENT]: 'A',
}

interface ResultsDisplayProps {
  results: Results
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({results}) => {
  return (
    <div className="results">
      <h2>Výsledky</h2>
      <table>
        <thead>
        <tr>
          <th></th>
          <th>konzonantov (K.)</th>
          <th>vokálov (V)</th>
        </tr>
        </thead>
        <tbody>
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
        </tbody>
        <thead>
        <tr>
          <th></th>
          <th colSpan={2}>konsonanty + vokály (K. + V.)</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Suma cieľových foném</td>
          <td colSpan={2}>{totalPhonemesCount(results)}</td>
        </tr>
        <tr>
          <td>Suma správnych foném</td>
          <td colSpan={2}>{correctPhonemesCount(results)}</td>
        </tr>
        </tbody>
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

      <h3>Fonetický repertoár</h3>
      <table>
        <tbody>
        <tr title="Konzonanty vyslovené na každej testovanej pozícii aspoň raz správne vyslovené">
          <td>Počet konsonantov produkovaných vo všetkých pozíciách správne</td>
          <td>{consonantsCorrectInAllPositionsCount(results)} / {totalConsonantsCount(results)}</td>
        </tr>
        <tr
          title="Nekonštantne = na ľubovoľnej pozícii aspoň 1 správne a aspoň 1 nesprávne (distorzne, nezrelo alebo absent.)">
          <td>Počet konsonantov produkovaných nekonštantne</td>
          <td>{nonConstantConsonantsCount(results)} / {totalConsonantsCount(results)}</td>
        </tr>
        <tr title="Konzonanty vyslovené aspoň raz na aspoň jednej pozícii nezrelo">
          <td>Počet konsonantov produkovaných nezrelo</td>
          <td>{consonantsWithStatusCount(results, PhonemeStatus.IMMATURE)} / {totalConsonantsCount(results)}</td>
        </tr>
        <tr title="Konzonanty vyslovené aspoň raz na aspoň jednej pozícii distorzne">
          <td>Počet konsonantov produkovaných distorzne</td>
          <td>{consonantsWithStatusCount(results, PhonemeStatus.DISTORTED)} / {totalConsonantsCount(results)}</td>
        </tr>
        <tr title="Konzonanty absentujúce aspoň raz na aspoň jednej pozícii">
          <td>Počet konsonantov absentuje / vypíšte</td>
          <td>{consonantsWithStatusCount(results, PhonemeStatus.ABSENT)} / {totalConsonantsCount(results)}{consonantsWithStatusCount(results, PhonemeStatus.ABSENT) > 0 ? `: ${consonantsWithStatus(results, PhonemeStatus.ABSENT)}` : ''}</td>
        </tr>
        <tr title="Vokály / diftongy absentujúce aspoň raz na aspoň jednej pozícii">
          <td>Absencia vokálov / diftongov</td>
          <td>{vocalsWithStatusCount(results, PhonemeStatus.ABSENT)} / {totalVocalsCount(results)}, {diphthongsWithStatusCount(results, PhonemeStatus.ABSENT)} / {totalDiphthongsCount(results)}</td>
        </tr>
        </tbody>
      </table>
      <br/>
      <h3>Detailné výsledky podľa slov</h3>
      {Object.entries(results).map(([word, phonemeResults]) => (
        <div key={word}>
          <span className="variable-label">{word}</span>
          <span>: {phonemeResults.map(phonemeResult => // TODO Implement phonological processes
            typeof phonemeResult === 'number' ? phonemeStatusLabels[phonemeResult] : phonemeResult
          ).join(', ')}</span>
        </div>
      ))}
    </div>
  )
}

export default ResultsDisplay