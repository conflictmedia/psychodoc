'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from '../hooks/use-toast'
import { useDoseStore } from '../store/dose-store'
import { DoseLog } from '../types'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const SYNC_AUTH_KEY = 'drugucopia-sync-auth'

// --- CRYPTO UTILS ---
const buf2base64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const base642buf = (b64: string) => new Uint8Array([...atob(b64)].map(c => c.charCodeAt(0)))

const hashRoomName = async (roomName: string, password: string) => {
  const data = new TextEncoder().encode(roomName + password + 'drugucopia-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
}

const deriveKey = async (password: string, salt: string) => {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
  )
}

const encryptData = async (dataObj: any, key: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(dataObj)))
  return { iv: buf2base64(iv), ciphertext: buf2base64(ciphertext) }
}

const decryptData = async (encryptedObj: { iv: string; ciphertext: string }, key: CryptoKey) => {
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base642buf(encryptedObj.iv) }, key, base642buf(encryptedObj.ciphertext))
  return JSON.parse(new TextDecoder().decode(decrypted))
}

const getUpdateTime = (d: DoseLog) => new Date(d.updatedAt || d.createdAt).getTime()

const mergeDoses = (local: DoseLog[], remote: DoseLog[], localDeleted: Set<string>, remoteDeleted: Set<string>) => {
  const allDeleted = new Set([...localDeleted, ...remoteDeleted])
  const map = new Map<string, DoseLog>()

  for (const d of local) {
    if (!allDeleted.has(d.id)) map.set(d.id, d)
  }

  for (const d of remote) {
    if (allDeleted.has(d.id)) { map.delete(d.id); continue }
    const existing = map.get(d.id)

    // Check if it's new OR if the remote updatedAt is newer than the local updatedAt
    if (!existing || getUpdateTime(d) > getUpdateTime(existing)) {
      map.set(d.id, d)
    }
  }

  const doses = Array.from(map.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  return { doses, deleted: allDeleted }
}
// --- CONTEXT ---
interface SyncContextType {
  syncStatus: 'idle' | 'connecting' | 'synced' | 'error'
  roomId: string
  password: string
  setRoomId: (id: string) => void
  setPassword: (pw: string) => void
  connectToSync: (rId?: string, pass?: string) => Promise<void>
  disconnectSync: () => void
}

const SyncContext = createContext<SyncContextType | null>(null)

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const { doses, deletedIds, initialize, setDosesFromSync, isLoaded } = useDoseStore()

  const [syncStatus, setSyncStatus] = useState<'idle' | 'connecting' | 'synced' | 'error'>('idle')
  const [roomId, setRoomId] = useState('')
  const [password, setPassword] = useState('')

  const cryptoKeyRef = useRef<CryptoKey | null>(null)
  const hashedRoomRef = useRef<string | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const lastPushedHashRef = useRef<string | null>(null)
  const isPushingRef = useRef(false)

  // Initialize Zustand store on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  const pushToSync = useCallback(async () => {
    if (!cryptoKeyRef.current || !hashedRoomRef.current || isPushingRef.current || !isLoaded) return
    isPushingRef.current = true
    try {
      const payload = { doses, deleted: [...deletedIds] }
      const encrypted = await encryptData(payload, cryptoKeyRef.current)
      lastPushedHashRef.current = encrypted.ciphertext.substring(0, 32)
      await setDoc(doc(db, 'secure_rooms', hashedRoomRef.current), {
        encrypted,
        updatedAt: serverTimestamp(),
      })
    } catch (e) {
      console.error('Failed to push sync:', e)
    } finally {
      isPushingRef.current = false
    }
  }, [doses, deletedIds, isLoaded])

  // Automatically push to sync whenever local store changes (if synced)
  useEffect(() => {
    if (syncStatus === 'synced' && isLoaded) {
      pushToSync()
    }
  }, [doses, deletedIds, syncStatus, isLoaded, pushToSync])

  const connectToSync = async (rId = roomId, pass = password) => {
    if (!rId || !pass) return
    if (!window.crypto?.subtle) {
      toast({ title: 'Encryption Blocked', description: 'HTTPS is required for syncing.', variant: 'destructive' })
      return
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    setSyncStatus('connecting')
    try {
      cryptoKeyRef.current = await deriveKey(pass, rId)
      hashedRoomRef.current = await hashRoomName(rId, pass)
      localStorage.setItem(SYNC_AUTH_KEY, JSON.stringify({ savedRoom: rId, savedPass: pass }))

      const docRef = doc(db, 'secure_rooms', hashedRoomRef.current)

      unsubscribeRef.current = onSnapshot(docRef, async (docSnap) => {
        if (isPushingRef.current) return

        if (!docSnap.exists()) {
          pushToSync()
          return
        }

        const remoteData = docSnap.data()
        const remoteHash = remoteData.encrypted?.ciphertext?.substring(0, 32)
        if (remoteHash && remoteHash === lastPushedHashRef.current) return

        try {
          const payload = await decryptData(remoteData.encrypted, cryptoKeyRef.current!)
          const remoteDoses: DoseLog[] = Array.isArray(payload) ? payload : payload.doses ?? []
          const remoteDeleted: Set<string> = new Set(Array.isArray(payload) ? [] : payload.deleted ?? [])

          const { doses: merged, deleted: mergedDeleted } = mergeDoses(useDoseStore.getState().doses, remoteDoses, useDoseStore.getState().deletedIds, remoteDeleted)

          setDosesFromSync(merged, mergedDeleted)

        } catch (e) {
          console.error('Decryption failed:', e)
          setSyncStatus('error')
        }
      })

      setSyncStatus('synced')
      toast({ title: 'Secure Sync Active', description: 'Your data is now end-to-end encrypted and syncing.' })
    } catch (error) {
      console.error('Sync connection error:', error)
      setSyncStatus('error')
    }
  }

  const disconnectSync = () => {
    if (unsubscribeRef.current) unsubscribeRef.current()
    unsubscribeRef.current = null
    cryptoKeyRef.current = null
    hashedRoomRef.current = null
    lastPushedHashRef.current = null
    localStorage.removeItem(SYNC_AUTH_KEY)
    setSyncStatus('idle')
    setRoomId('')
    setPassword('')
    toast({ title: 'Sync Disconnected', description: 'Data will only save locally.' })
  }

  // Auto-connect on load
  useEffect(() => {
    const savedAuth = localStorage.getItem(SYNC_AUTH_KEY)
    if (savedAuth) {
      try {
        const { savedRoom, savedPass } = JSON.parse(savedAuth)
        setRoomId(savedRoom)
        setPassword(savedPass)
        connectToSync(savedRoom, savedPass)
      } catch {
        localStorage.removeItem(SYNC_AUTH_KEY)
      }
    }
    return () => { if (unsubscribeRef.current) unsubscribeRef.current() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SyncContext.Provider value={{ syncStatus, roomId, password, setRoomId, setPassword, connectToSync, disconnectSync }}>
      {children}
    </SyncContext.Provider>
  )
}

export const useSync = () => {
  const context = useContext(SyncContext)
  if (!context) throw new Error("useSync must be used within a SyncProvider")
  return context
}
