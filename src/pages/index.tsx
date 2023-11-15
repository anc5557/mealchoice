// mealchoice/src/pages/index.tsx

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const router = useRouter();

  // 구글 로그인 버튼 클릭 핸들러
  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    // next-auth의 signIn 함수를 이용해 구글 로그인
    signIn('google', { callbackUrl: '/home' });
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleSignIn}>구글로 로그인하기</button>
    </div>
  );
};

export default Login;
