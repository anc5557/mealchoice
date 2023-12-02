import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";

// 제네릭 타입 P를 사용하여 WrappedComponent의 props 타입을 유지합니다.
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  needAuth = true
) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const { isLoggedIn } = useSelector((state: RootState) => state.user); // Redux 스토어에서 로그인 상태를 가져옵니다.

    useEffect(() => {
      if (needAuth && !isLoggedIn) {
        router.push("/");
      } else if (!needAuth && isLoggedIn) {
        router.push("/home");
      }
    }, [isLoggedIn, router, needAuth]);

    return isLoggedIn || !needAuth ? <WrappedComponent {...props} /> : null;
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
};

export default withAuth;
