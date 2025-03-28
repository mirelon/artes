import {Pencil, Play, Plus, Save, Trash, User} from 'lucide-react'
import React, {useEffect, useRef, useState} from 'react'

import {addChild, AppState, ChildProfile, displayGender, isValidDate} from './appState'
import {Page} from './pages.ts'
import {Word} from './phonemes'

interface ChildrenListProps {
  appState: AppState
  setAppState: (newState: AppState) => void
  words: Word[]
  setCurrentPage: (currentPage: Page) => void
  updateChild: (updates: Partial<ChildProfile>) => void
}

const ChildrenList: React.FC<ChildrenListProps> = ({ appState, setAppState, words, setCurrentPage, updateChild}) => {
  const {children, currentChildId} = appState
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ name?: string; birth?: string; gender?: 'M' | 'F' }>({})
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    console.log(editingId, nameInputRef)
    if (editingId && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editingId])

  const handleAddChild = () => {
    setFormData({})
    const newState = addChild(children, words)
    setEditingId(newState.currentChildId)
    setAppState(newState)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId == null) {
      alert('Cannot submit, editingId is null')
      return
    }
    if (formData.birth && !isValidDate(formData.birth)) {
      alert('Dátum narodenia musí byť vo formáte DD.MM.YYYY')
      return
    }
    updateChild({...formData, gender: formData.gender || undefined})
    setEditingId(null)
  }

  const handleProfileClick = (childId: string) => {
    setAppState({...appState, currentChildId: childId})
    setCurrentPage('childDisplay')
  }

  const handleStartEditing = (childId: string) => {
    setFormData(appState.children[childId]!)
    setEditingId(childId)
  }

  const handleDeleteChild = (childId: string) => {
    if (confirm('Naozaj chcete odstrániť toto dieťa?')) {
      const updatedChildren = { ...appState.children }
      delete updatedChildren[childId]
      if (Object.keys(updatedChildren).length === 0) {
        addChild({}, words)
        return
      }
      const updatedCurrentChildId = appState.currentChildId === childId ? Object.keys(updatedChildren)[0]! : appState.currentChildId
      const newState = { ...appState, children: updatedChildren, currentChildId: updatedCurrentChildId }
      setAppState(newState)
      localStorage.setItem('artesAppState', JSON.stringify(newState))
    }
  }

  const handleSelectChild = (childId: string) => {
    const newState = { ...appState, currentChildId: childId }
    setAppState(newState)
    localStorage.setItem('artesAppState', JSON.stringify(newState))
  }

  return (
    <div className="children-list">
      {Object.entries(children).map(([childId, child]) => (
        <div
          key={childId}
          className={`child-container ${currentChildId === childId ? 'selected' : ''}`}
          onClick={() => handleSelectChild(childId)}
        >
          {editingId === childId ? (
            <form onSubmit={handleSubmit} className="child-form">
              <input ref={nameInputRef} type="text" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Meno" />
              <input type="text" name="birth" value={formData.birth || ''} onChange={handleInputChange} placeholder="DD.MM.YYYY" />
              <select name="gender" value={formData.gender || ''} onChange={handleInputChange}>
                <option value="">Vyberte...</option>
                <option value="M">{displayGender('M')}</option>
                <option value="F">{displayGender('F')}</option>
              </select>
              <button type="submit"><Save className="save-icon"/></button>
            </form>
          ) : (
            <div className="child-info" onClick={(e) => { e.stopPropagation(); handleSelectChild(childId) }}>
              <span className="child-name">{child.name || `Dieťa ${childId.slice(0,6)}`}</span>
              <span className="child-gender">{displayGender(child.gender)}</span>
              <span className="child-birth">{child.birth ? `Dátum narodenia: ${child.birth}` : 'Neznámy dátum'}</span>
              <Play className="play-icon" onClick={(e) => { e.stopPropagation(); setCurrentPage('wordDisplay') }}/>
              <Pencil className="edit-icon" onClick={(e) => { e.stopPropagation(); handleStartEditing(childId) }}/>
              <User className="profile-icon" onClick={(e) => { e.stopPropagation(); handleProfileClick(childId) }} />
              <Trash className="delete-icon" onClick={(e) => { e.stopPropagation(); handleDeleteChild(childId) }} />
            </div>
          )}
        </div>
      ))}
      <div className="child-container add-child" onClick={handleAddChild}>
        <Plus className="add-icon" />
      </div>
    </div>
  )
}

export default ChildrenList
