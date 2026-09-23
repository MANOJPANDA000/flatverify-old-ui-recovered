import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDocs,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AreaDisplayUnit, PropertyAudit, UserProfile } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface SessionContextType {
  user: UserProfile;
  audits: PropertyAudit[];
  displayUnit: AreaDisplayUnit;
  setDisplayUnit: (unit: AreaDisplayUnit) => void;
  defaultInternalWallPercent: number;
  setDefaultInternalWallPercent: (val: number) => void;
  defaultExternalWallPercent: number;
  setDefaultExternalWallPercent: (val: number) => void;
  defaultLoadingPercent: number;
  setDefaultLoadingPercent: (val: number) => void;
  saveAudit: (audit: Omit<PropertyAudit, 'id' | 'timestamp' | 'userId'> & { id?: string; timestamp?: string; userId?: string }) => Promise<PropertyAudit>;
  deleteAudit: (id: string) => Promise<boolean>;
  getAudit: (id: string) => PropertyAudit | undefined;
  logout: () => Promise<void>;
  clearAllData: () => Promise<void>;
  isInitializing: boolean;
  // Biometric/Local Lock Architecture
  isLocked: boolean;
  unlockApp: () => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

const SETTINGS_STORAGE_KEY = 'flatverify_settings_v2';
const BIOMETRIC_PREF_KEY = 'flatverify_biometric_prefs';

const DEFAULT_USER: UserProfile = {
  uid: 'guest_user',
  email: '',
  displayName: 'Guest Auditor',
  isGuest: true,
  createdAt: new Date().toISOString(),
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [audits, setAudits] = useState<PropertyAudit[]>([]);

  const [displayUnit, setDisplayUnitState] = useState<AreaDisplayUnit>(() => {
    try {
      const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.displayUnit) return parsed.displayUnit;
      }
    } catch (_) {}
    return 'imperial';
  });

  const [defaultInternalWallPercent, setDefaultInternalWallPercentState] = useState<number>(12.0);
  const [defaultExternalWallPercent, setDefaultExternalWallPercentState] = useState<number>(0.0);
  const [defaultLoadingPercent, setDefaultLoadingPercentState] = useState<number>(30.0);

  // Helper to get biometric preference for a specific user
  const getBiometricPreference = (uid: string): boolean => {
    try {
      const prefs = JSON.parse(localStorage.getItem(BIOMETRIC_PREF_KEY) || '{}');
      return !!prefs[uid];
    } catch (_) {
      return false;
    }
  };

  // Helper to set biometric preference for a specific user
  const saveBiometricPreference = (uid: string, enabled: boolean) => {
    try {
      const prefs = JSON.parse(localStorage.getItem(BIOMETRIC_PREF_KEY) || '{}');
      prefs[uid] = enabled;
      localStorage.setItem(BIOMETRIC_PREF_KEY, JSON.stringify(prefs));
    } catch (_) {}
  };

  // Handle Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const newUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          isGuest: false,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };
        
        setUser(newUser);
        
        // Check if biometric lock should be active
        const isBioEnabled = getBiometricPreference(firebaseUser.uid);
        setBiometricEnabledState(isBioEnabled);
        
        if (isBioEnabled) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      } else {
        setUser(DEFAULT_USER);
        setAudits([]); // Clear audits on logout
        setIsLocked(false);
        setBiometricEnabledState(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Audits with Firestore when authenticated and NOT locked
  useEffect(() => {
    if (user.isGuest || !user.uid || isLocked) return;

    const auditsPath = `users/${user.uid}/audits`;
    const auditsRef = collection(db, auditsPath);
    const q = query(auditsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as PropertyAudit);
      setAudits(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, auditsPath);
    });

    return () => unsubscribe();
  }, [user.uid, user.isGuest, isLocked]);

  const setDisplayUnit = (unit: AreaDisplayUnit) => {
    setDisplayUnitState(unit);
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
      settings.displayUnit = unit;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
  };

  const setBiometricEnabled = (enabled: boolean) => {
    if (user.isGuest) return;
    setBiometricEnabledState(enabled);
    saveBiometricPreference(user.uid, enabled);
  };

  const unlockApp = () => {
    setIsLocked(false);
  };

  const setDefaultInternalWallPercent = (val: number) => setDefaultInternalWallPercentState(val);
  const setDefaultExternalWallPercent = (val: number) => setDefaultExternalWallPercentState(val);
  const setDefaultLoadingPercent = (val: number) => setDefaultLoadingPercentState(val);

  const saveAudit = async (
    auditData: Omit<PropertyAudit, 'id' | 'timestamp' | 'userId'> & { id?: string; timestamp?: string; userId?: string }
  ): Promise<PropertyAudit> => {
    if (user.isGuest) {
      throw new Error('Please sign in to save audits.');
    }

    const auditId = auditData.id || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const auditsPath = `users/${user.uid}/audits`;
    
    const newAudit: PropertyAudit = {
      ...auditData,
      id: auditId,
      userId: user.uid,
      timestamp: auditData.timestamp || new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, auditsPath, auditId), newAudit);
      return newAudit;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${auditsPath}/${auditId}`);
      throw error;
    }
  };

  const deleteAudit = async (id: string): Promise<boolean> => {
    if (user.isGuest) return false;

    const auditPath = `users/${user.uid}/audits/${id}`;
    try {
      await deleteDoc(doc(db, auditPath));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, auditPath);
      return false;
    }
  };

  const getAudit = (id: string): PropertyAudit | undefined => {
    return audits.find(a => a.id === id);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const clearAllData = async () => {
    if (user.isGuest) return;
    
    const auditsPath = `users/${user.uid}/audits`;
    try {
      const snapshot = await getDocs(collection(db, auditsPath));
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, auditsPath, d.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, auditsPath);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        audits,
        displayUnit,
        setDisplayUnit,
        defaultInternalWallPercent,
        setDefaultInternalWallPercent,
        defaultExternalWallPercent,
        setDefaultExternalWallPercent,
        defaultLoadingPercent,
        setDefaultLoadingPercent,
        saveAudit,
        deleteAudit,
        getAudit,
        logout,
        clearAllData,
        isInitializing,
        isLocked,
        unlockApp,
        biometricEnabled,
        setBiometricEnabled
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
