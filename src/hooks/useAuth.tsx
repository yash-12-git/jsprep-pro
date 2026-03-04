'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { getUserProgress, updateStreak, UserProgress } from '@/lib/userProgress'

interface AuthContextType {
  user: User | null
  progress: UserProgress | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProgress: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProgress(u: User) {
    const p = await getUserProgress(u.uid)
    setProgress(p)
    await updateStreak(u.uid)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) await loadProgress(u)
      else setProgress(null)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function logout() {
    await signOut(auth)
  }

  async function refreshProgress() {
    if (user) {
      const p = await getUserProgress(user.uid)
      setProgress(p)
    }
  }

  return (
    <AuthContext.Provider value={{ user, progress, loading, signInWithGoogle, logout, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
