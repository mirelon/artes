import React, {useEffect, useState} from 'react'
import './App.css'

import {AppState, ChildProfile, initialAppState} from './appState.ts'
import ChildrenList from './ChidrenList.tsx'
import ChildDisplay from './ChildDisplay.tsx'
import {fetchWordList} from './helpers.ts'
import {Page} from './pages.ts'
import {Word} from './phonemes.ts'
import WordDisplay from './WordDisplay.tsx'

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([])
  const [isLoadingWords, setIsLoadingWords] = useState(true)
  const [errorLoadingWords, setErrorLoadingWords] = useState<string | null>(null)
  const [maxWordLength, setMaxWordLength] = useState(1)
  const [appState, setAppState] = useState<AppState | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('childrenList')

  // Fetch the words on initial load
  useEffect(() => {
    const loadWords = async () => {
      try {
        const loadedWords = await fetchWordList()
        setWords(loadedWords)
        setMaxWordLength(Math.max(...loadedWords.map((word) => word.phonemes.length)))
      } catch (e: unknown) {
        if (e instanceof Error) setErrorLoadingWords(`When loading words: ${e.message}`)
        else setErrorLoadingWords(`When loading words: ${JSON.stringify(e)}`)
      } finally {
        setIsLoadingWords(false)
      }
    }
    loadWords()
  }, [])

  useEffect(() => {
    const storedState = localStorage.getItem('artesAppState')
    if (storedState) {
      try {
        return setAppState(JSON.parse(storedState))
      } catch { /* Continue with initialization of app state */ }
    }
    const appState = initialAppState(words)
    setAppState(appState)
    localStorage.setItem('artesAppState', JSON.stringify(appState))
  }, [words])

  // Calculate box size and gap dynamically based on screen width and word length
  const boxSize = 0.6 * window.innerWidth / maxWordLength

  const updateChildInLocalStorage = (appState: AppState) => (updates: Partial<ChildProfile>) => {
    const {children, currentChildId} = appState
    const childProfile = children[currentChildId]!
    const newAppState = {
      ...appState,
      children: {...children, [currentChildId]: {...childProfile, ...updates}}
    }
    setAppState(newAppState)
    localStorage.setItem('artesAppState', JSON.stringify(newAppState))
  }

  return (
    <div className="container">
      {isLoadingWords ? (
        <div>Loading words...</div>
      ) : errorLoadingWords ? (
        <div>Error: {errorLoadingWords}</div>
      ) : !appState ? (
        <div>Words are loaded, but App is not initialized</div>
      ) : (
        (() => {
          const childProfile = appState.children[appState.currentChildId]
          if (!childProfile) return <div>No child selected</div>

          if (currentPage === 'childDisplay') {
            return (
              <ChildDisplay
                childProfile={childProfile}
                updateChild={updateChildInLocalStorage(appState)}
                setCurrentPage={setCurrentPage}
              />
            )
          }
          if (currentPage === 'wordDisplay') {
            return (
              <WordDisplay
                words={words}
                appState={appState}
                updateChild={updateChildInLocalStorage(appState)}
                boxSize={boxSize}
                setCurrentPage={setCurrentPage}
              />
            )
          }
          return (
            <ChildrenList
              appState={appState}
              setAppState={setAppState}
              words={words}
              setCurrentPage={setCurrentPage}
              updateChild={updateChildInLocalStorage(appState)}
              />
          )
        })()
      )}
    </div>
  )
}

export default App
