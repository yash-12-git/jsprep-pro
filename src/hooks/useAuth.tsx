"use client";
import { savePendingSprint } from "@/lib/sprintHistory";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { track } from "@/lib/analytics";
import { claimInviteCode, rememberInviteCode } from "@/lib/rewardsClient";
import { getUserProgressAndStreak, UserProgress } from "@/lib/userProgress";
import { promoProEnd, type PromoFields } from "@/lib/promoPro";

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function applyExpiryCheck(p: UserProgress): UserProgress {
  // Free Pro earned through feedback or referrals counts as Pro until it ends.
  if (p.promoProUntil && new Date(p.promoProUntil) > new Date()) {
    return { ...p, isPro: true };
  }
  // If Pro has a set expiry date and it's in the past, downgrade client-side
  if (p.isPro && p.proExpiresAt) {
    const expired = new Date(p.proExpiresAt) < new Date();
    if (expired) return { ...p, isPro: false };
  }
  return p;
}

/** Earned Pro, written only by the server. Missing or unreadable means none. */
async function loadPromo(uid: string): Promise<PromoFields | undefined> {
  try {
    const snap = await getDoc(doc(db, "entitlements", uid));
    return snap.data() as PromoFields | undefined;
  } catch {
    return undefined;
  }
}

async function loadFullProgress(uid: string): Promise<UserProgress> {
  const [p, promo] = await Promise.all([getUserProgressAndStreak(uid), loadPromo(uid)]);
  const end = promoProEnd(promo, p);
  return applyExpiryCheck({ ...p, promoProUntil: end ? new Date(end).toISOString() : null });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProgress(u: User) {
    try {
      setProgress(await loadFullProgress(u.uid));
    } catch (err) {
      console.error("[useAuth] loadProgress failed — retrying once", err);
      // Retry once after 1.5s (covers transient Firestore network blip)
      try {
        await new Promise((r) => setTimeout(r, 1500));
        setProgress(await loadFullProgress(u.uid));
      } catch (retryErr) {
        console.error("[useAuth] loadProgress retry failed", retryErr);
        // Fall through with progress = null rather than staying in loading state
      }
    }
  }

  useEffect(() => {
    // An invite link (?ref=CODE) can land on any page.
    rememberInviteCode();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProgress(u);
        savePendingSprint(u.uid);
      }
      else setProgress(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const isNew = getAdditionalUserInfo(result)?.isNewUser ?? false;
    track(isNew ? "sign_up" : "login", { method: "google" });
    if (isNew) claimInviteCode();
  }

  async function logout() {
    await signOut(auth);
  }

  async function refreshProgress() {
    if (user) {
      setProgress(await loadFullProgress(user.uid));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        loading,
        signInWithGoogle,
        logout,
        refreshProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
