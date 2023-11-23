import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { getAuth, User } from 'firebase/auth';
import nookies from 'nookies';

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const AuthProvider = ({ children }: any) => {
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    return getAuth().onIdTokenChanged(async (user) => {
      if (!user) {
        // ID토큰 없음
        setUserState(null);
        nookies.set(null, 'token', '', { path: '/' });
        return;
      }

      setUserState(user); // 사용자 정보 저장
      const token = await user.getIdToken(); // ID토큰 가져오기 
      nookies.destroy(null, 'token'); // 이전 토큰 제거
      nookies.set(null, 'token', token, { path: '/' }); // 새 토큰 설정
    });
  }, []);

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      const { currentUser } = getAuth();
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshToken);
  }, []);

  const user = useMemo(
    () => ({
      user: userState,
    }),
    [userState]
  );

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};