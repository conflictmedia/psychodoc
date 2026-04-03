import { create } from 'zustand'
import { DoseLog } from '../types'

const STORAGE_KEY = 'drugucopia-dose-logs'
const DELETED_KEY = 'drugucopia-deleted-ids'

interface DoseStore {
  doses: DoseLog[]
  deletedIds: Set<string>
  isLoaded: boolean

  initialize: () => void
  addDose: (dose: DoseLog) => void
  updateDose: (dose: DoseLog) => void
  deleteDose: (id: string) => void
  setDosesFromSync: (doses: DoseLog[], deletedIds: Set<string>) => void
}

export const useDoseStore = create<DoseStore>((set, get) => ({
  doses: [],
  deletedIds: new Set(),
  isLoaded: false,

  initialize: () => {
    if (get().isLoaded) return
    try {
      const localDoses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const localDeleted = new Set<string>(JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'))

      const sortedDoses = localDoses.sort((a: DoseLog, b: DoseLog) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      set({ doses: sortedDoses, deletedIds: localDeleted, isLoaded: true })

      // Listen for changes from other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const freshDoses = JSON.parse(e.newValue || '[]')
          set({ doses: freshDoses })
        }
        if (e.key === DELETED_KEY) {
          set({ deletedIds: new Set(JSON.parse(e.newValue || '[]')) })
        }
      })
    } catch (e) {
      console.error('Failed to parse local storage', e)
    }
  },

  addDose: (dose) => {
    set((state) => {
      const updated = [dose, ...state.doses].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { doses: updated }
    })
  },

  updateDose: (updatedDose) => {
    set((state) => {
      const updated = state.doses.map(d => d.id === updatedDose.id ? updatedDose : d).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { doses: updated }
    })
  },

  deleteDose: (id) => {
    set((state) => {
      const updatedDoses = state.doses.filter(d => d.id !== id)
      const updatedDeleted = new Set(state.deletedIds).add(id)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDoses))
      localStorage.setItem(DELETED_KEY, JSON.stringify([...updatedDeleted]))

      return { doses: updatedDoses, deletedIds: updatedDeleted }
    })
  },

  setDosesFromSync: (doses, deletedIds) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doses))
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds]))
    set({ doses, deletedIds })
  }
}))
