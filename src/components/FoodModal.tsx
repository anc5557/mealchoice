import React from "react";

// 타입 정의
interface FoodModalProps {
  type: "like" | "hate";
  isOpen: boolean;
  onClose: () => void;
  foodList: string[];
  onRemoveFood: (foodname: string) => void;
}

const FoodModal = ({
  type,
  isOpen,
  onClose,
  foodList,
  onRemoveFood,
}: FoodModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl transform transition-all h-[450px] w-[300px] overflow-hidden"> {/* 크기 고정 */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-5">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              {type === "like" ? "좋아하는 음식" : "싫어하는 음식"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="flex-grow overflow-auto">
            {foodList.length === 0 ? (
              <p className="text-sm text-gray-500 p-4 text-center">
                리스트가 비어 있습니다.
              </p>
            ) : (
              <ul className="text-sm text-gray-500">
                {foodList.map((foodname) => (
                  <li
                    key={foodname}
                    className="flex justify-between items-center p-3 border-b mx-4"
                  >
                    <span className="text-md font-medium">{foodname}</span>
                    <button
                      onClick={() => onRemoveFood(foodname)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
