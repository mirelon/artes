export type Phoneme = string

export type Word = { raw: string, phonemes: Phoneme[] }

const diphtongs = ['ch', 'dz', 'dž', 'ia', 'ie', 'iu']
const voiced = ['b', 'd', 'ď', 'dz', 'dž', 'z', 'ž', 'g', 'h', 'v']
const unvoiced = ['p', 't', 'ť', 'c', 'č', 's', 'š', 'k', 'ch', 'f']
const consonantsToSoften = ['d', 't', 'n']
const softenedConsontants = ['ď', 'ť', 'ň']

const isUnvoiced = (phoneme: Phoneme) => unvoiced.indexOf(phoneme) !== -1
const isVoiced = (phoneme: Phoneme) => voiced.indexOf(phoneme) !== -1

const voicedToUnvoiced = (phoneme: Phoneme): Phoneme => {
  const index = voiced.indexOf(phoneme)
  if (index === -1) return phoneme
  return unvoiced[index]
}

const unvoicedToVoiced = (phoneme: Phoneme): Phoneme => {
  const index = unvoiced.indexOf(phoneme)
  if (index === -1) return phoneme
  return voiced[index]
}

const yToI = (phoneme: Phoneme): Phoneme => {
  if (phoneme === 'y') return 'i'
  if (phoneme === 'ý') return 'í'
  return phoneme
}

const toPhonemes = (raw: string): Phoneme[] => {
  if (raw.length === 0) return []
  const [phoneme, rest] = diphtongs.includes(raw.slice(0, 2))
    ? [raw.slice(0, 2), raw.slice(2)]
    : [raw[0], raw.slice(1)]
  return [phoneme, ...toPhonemes(rest)]
}

const softenExceptions = ['deka']

const applyAssimilations = (phonemes: Phoneme[], isWhole: boolean): Phoneme[] => {
  if (phonemes.length === 0) return []
  if (phonemes.length === 1) return [voicedToUnvoiced(phonemes[0])] // Unvoice last phoneme if it is voiced consonant
  if (['e', 'é', 'i', 'í'].includes(phonemes[1])) {
    const index = consonantsToSoften.indexOf(phonemes[0])
    if (index !== -1 && !softenExceptions.includes(phonemes.join(''))) return [softenedConsontants[index], phonemes[1], ...applyAssimilations(phonemes.slice(2), false)]
  }
  if (isVoiced(phonemes[0]) && isUnvoiced(phonemes[1])) return [voicedToUnvoiced(phonemes[0]), phonemes[1], ...applyAssimilations(phonemes.slice(2), false)]
  if (isUnvoiced(phonemes[0]) && isVoiced(phonemes[1]) && !isWhole) return [unvoicedToVoiced(phonemes[0]), phonemes[1], ...applyAssimilations(phonemes.slice(2), false)]
  return [phonemes[0], ...applyAssimilations(phonemes.slice(1), false)]
}

export const toWord = (raw: string): Word => {
  return {raw, phonemes: applyAssimilations(toPhonemes(raw.replace(/\s+/g, '')), true).map(yToI)}
}