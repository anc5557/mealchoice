// path : src/hooks/withAuth.ts

// 로그인 상태를 확인해 로그인하지 않은 경우 로그인 페이지로 이동시키고, 로그인한 경우에는 페이지를 그대로 렌더링
// 반대로 로그인한 경우에 로그인페이지로 접근하면 home으로 이동시킴
// 입력 : 접근 하려는 페이지 경로 (string)
// 출력 : 로그인 상태에 따라 페이지 이동, 그대로 렌더링, home으로 이동, index으로 이동

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";

const withAuth = (WrappedComponent: React.ComponentType, needAuth = true) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter();
    const { isLoggedIn } = useSelector((state: RootState) => state.user); // Redux 스토어에서 로그인 상태를 가져옵니다.

    useEffect(() => {
      if (needAuth && !isLoggedIn) {
        router.push("/");
      } else if (!needAuth && isLoggedIn) {
        router.push("/home");
      }
    }, [isLoggedIn, router]);

    return isLoggedIn || !needAuth ? <WrappedComponent {...props} /> : null;
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
};

export default withAuth;
