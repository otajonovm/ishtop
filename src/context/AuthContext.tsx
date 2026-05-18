import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabase Auth o'rniga oddiy localStorage dan profilni o'qiymiz
    const getSession = async () => {
      const storedProfile = localStorage.getItem('mock_user_profile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUser({ id: parsedProfile.id, email: parsedProfile.email });
        setProfile(parsedProfile);
      }
      setLoading(false);
    };

    getSession();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('mock_user_profile');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, setProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
