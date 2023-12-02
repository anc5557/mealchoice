// path : /src/components/HistoryMemoModal.tsx

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface HistoryMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: string;
  onSave: (memo: string) => void;
}

const HistoryMemoModal = ({
  isOpen,
  onClose,
  memo,
  onSave,
}: HistoryMemoModalProps) => {
  const [editedMemo, setEditedMemo] = useState(memo);

  useEffect(() => {
    setEditedMemo(memo);
  }, [memo]);

  const handleClose = () => {
    onSave(editedMemo); // 저장 로직을 먼저 실행
    onClose(); // 그 후 모달 닫기
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center`}
    >
      <div className="bg-white w-3/4 p-5 rounded-xl">
        <div className="flex justify-start pb-3 text-2xl">
          <button onClick={handleClose}>
            <FontAwesomeIcon icon={faArrowLeft} /> {/* 변경된 아이콘 */}
          </button>
        </div>
        <textarea
          className="w-full border rounded-xl p-5 mb-4 h-40 border-gray-500"
          value={editedMemo}
          onChange={(e) => setEditedMemo(e.target.value)}
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
};

export default HistoryMemoModal;
