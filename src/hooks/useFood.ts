// path : mealchoice/src/hooks/useFood.ts

import { db } from "../firebase/firebasedb";
import { useDispatch } from "react-redux";
import { setExclusionPeriod } from "../features/foodSlice";
import { getDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export const useFood = () => {
  const dispatch = useDispatch();

  const getExclusionPeriod = async (uid: string) => {
    // uid: 사용자 uid
    const userDocRef = doc(db, "food", uid); // food 컬렉션에서 사용자 uid를 가진 문서 참조
    const userDocSnap = await getDoc(userDocRef); // 문서 스냅샷 가져오기
    const userDocData = userDocSnap.data(); // 문서 데이터 가져오기

    if (userDocData) {
      dispatch(setExclusionPeriod(userDocData.exclusionPeriod));
    }

    return userDocData?.exclusionPeriod ?? [];
  };


  const updateExclusionPeriod = async (userId: string, days: number) => {
    try {
      const userDocRef = doc(db, 'food', userId);
      await updateDoc(userDocRef, {
        exclusionPeriod: days
      });
      // 리덕스 스토어에도 상태를 업데이트합니다.
      dispatch(setExclusionPeriod(days));
    } catch (error) {
      console.error("Error updating exclusion period: ", error);
    }
  };



  return { getExclusionPeriod, updateExclusionPeriod };
};
export default useFood;
