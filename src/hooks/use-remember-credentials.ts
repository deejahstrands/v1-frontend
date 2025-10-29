import { useState, useEffect } from 'react';

interface RememberedCredentials {
  email: string;
  rememberMe: boolean;
}

const STORAGE_KEY = 'admin_remembered_credentials';

export function useRememberCredentials() {
  const [rememberedCredentials, setRememberedCredentials] = useState<RememberedCredentials>({
    email: '',
    rememberMe: false
  });

  // Load remembered credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRememberedCredentials(parsed);
        }
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveCredentials = (email: string, rememberMe: boolean) => {
    if (typeof window !== 'undefined') {
      try {
        if (rememberMe) {
          const credentials: RememberedCredentials = { email, rememberMe };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
        } else {
          // Clear stored credentials if not remembering
          localStorage.removeItem(STORAGE_KEY);
        }
        setRememberedCredentials({ email, rememberMe });
      } catch (error) {
        console.error('Error saving remembered credentials:', error);
      }
    }
  };

  const clearCredentials = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setRememberedCredentials({ email: '', rememberMe: false });
    }
  };

  return {
    rememberedCredentials,
    saveCredentials,
    clearCredentials
  };
}
