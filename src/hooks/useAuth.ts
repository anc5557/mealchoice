// hooks/useAuth.ts
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app, db } from "../firebase/firebasedb";
import { useDispatch } from "react-redux";
import { logIn, updateDisplayName } from "../features/userSlice";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (providerType: string) => {
    try {
      const auth = getAuth(app);
      const provider =
        providerType === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email ?? "",
          displayName: result.user.displayName ?? "",
          profilePic: result.user.photoURL ?? undefined,
        };

        dispatch(logIn(userData));

        // Firestore에 사용자 데이터 저장
        await setDoc(doc(db, "users", userData.uid), userData);

        router.push("/home");
      }
    } catch (error) {
      // 에러 핸들링
      console.error("Authentication error:", error);
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        displayName: { value: string };
        email: { value: string };
        password: { value: string };
      };
      const displayName = target.displayName.value;
      const email = target.email.value;
      const password = target.password.value;

      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 프로필 사진에 기본값 설정
      const defaultProfilePic = "/default-profile.png";

      // Redux 스토어에 사용자 정보 저장
      if (user) {
        await updateProfile(user, {
          displayName: displayName,
          photoURL: defaultProfilePic,
        });

        // Firestore에 사용자 데이터 저장
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email ?? "",
          displayName: displayName,
          profilePic: user.photoURL ?? defaultProfilePic,
        });
      }

      router.push("/signin");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.name, error.message);
      } else {
        console.error("An unknown error occurred during sign up");
      }
    }
  };

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        email: { value: string };
        password: { value: string };
      };
      const email = target.email.value;
      const password = target.password.value;
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Redux 스토어에 사용자 정보 저장
      if (user) {
        dispatch(
          logIn({
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? "",
            profilePic: user.photoURL ?? "",
          })
        );

        // 로그인 성공 후 리디렉션 (예: 홈페이지나 대시보드 등)
        router.push("/home");
      }
    } catch (error) {
      if (error instanceof Error) {
        // 'error'가 'Error' 인스턴스인지 확인
        console.error(error.name, error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
  
  const handleEditDisplayName = async (newDisplayName: string) => {
    const auth = getAuth();
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      dispatch(updateDisplayName(newDisplayName));
    }
  };



  return { handleLogin, handleSignup, handleSignin, handleEditDisplayName };
};
