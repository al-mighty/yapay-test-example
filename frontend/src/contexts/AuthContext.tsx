import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { loading } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
    },
    onError: () => {
      localStorage.removeItem('token');
      setUser(null);
    },
    skip: !localStorage.getItem('token'),
  });

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading: !isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 