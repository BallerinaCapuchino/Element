import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { mockApi } from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void; // Используется для обновления локального стейта после действий в AuthModal
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Слушатель изменений состояния авторизации Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Если пользователь авторизован в Firebase, получаем его расширенные данные из Firestore
        try {
          const userProfile = await mockApi.getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Fallback если профиль еще не создан
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
            });
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    // Эта функция теперь скорее вспомогательная, т.к. onAuthStateChanged сделает основную работу,
    // но можно использовать для мгновенного обновления UI
    setUser(userData);
  };

  const logout = async () => {
    await mockApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
