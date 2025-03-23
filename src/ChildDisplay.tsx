import { Pencil } from 'lucide-react'
import React, {useState} from 'react'

import {ChildProfile, displayGender, isValidDate} from './appState.ts'
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

interface ChildDisplayProps {
  childProfile: ChildProfile
  updateChild: (updates: Partial<ChildProfile>) => void
}

const ChildDisplay: React.FC<ChildDisplayProps> = ({ childProfile, updateChild }) => {
  const { name, birth, gender, results } = childProfile

  const [editing, setEditing] = useState(!name || !birth || !gender)
  const [formData, setFormData] = useState({ name: name ?? '', birth: birth ?? '', gender: gender ?? ('' as const) })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidDate(formData.birth)) {
      alert('Dátum narodenia musí byť vo formáte DD.MM.YYYY')
      return
    }
    updateChild({...formData, gender: formData.gender || undefined})
    setEditing(false)
  }

  return (
    <div>
      <div className="child-info">
        {editing ? (
          <form onSubmit={handleSubmit} className="child-form">
            <label>
              Meno:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
            </label>
            <label>
              Dátum narodenia:
              <input type="text" name="birth" value={formData.birth} onChange={handleInputChange} required
                     placeholder="DD.MM.YYYY"/>
            </label>
            <label>
              Pohlavie:
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Vyberte...</option>
                <option value="M">{displayGender('M')}</option>
                <option value="F">{displayGender('F')}</option>
              </select>
            </label>
            <button type="submit">Uložiť</button>
          </form>
        ) : (
          <div className="child-info" onClick={() => setEditing(true)}>
            <span className="child-name">{name}</span>
            <span className="child-gender">{displayGender(gender)}</span>
            <span className="child-birth">Dátum narodenia: {birth}</span>
            <Pencil className="edit-icon"/>
          </div>
        )}
      </div>
      {Object.keys(results).length === 0 ? <div/> : (
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
      )}
    </div>
  )
}

export default ChildDisplay
