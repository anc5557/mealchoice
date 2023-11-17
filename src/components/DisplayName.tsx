import React from "react";

interface DisplayNameProps {
  isEditing: boolean;
  name: string;
  startEdit: () => void;
  newDisplayName: string;
  setNewDisplayName: (name: string) => void;
  confirmEdit: () => Promise<void>;
  cancelEdit: () => void;
}

const DisplayName: React.FC<DisplayNameProps> = ({
  isEditing,
  name,
  startEdit,
  newDisplayName,
  setNewDisplayName,
  confirmEdit,
  cancelEdit,
}) => (
  <div className="flex items-center mb-1">
    {!isEditing ? (
      <>
        <div className="text-2xl font-medium text-gray-800 mr-2">{name}</div>
        <button
          className="rounded-full hover:bg-gray-200 transition-color"
          onClick={startEdit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </>
    ) : (
      <>
        <input
          type="text"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          className="text-2xl font-medium text-gray-800 mr-2 w-full max-w-full box-border border border-gray-400 rounded-lg mr-2"
        />
        <button
          className="rounded-full hover:bg-gray-200 transition-color"
          onClick={confirmEdit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-green-500 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </button>
        <button
          className="rounded-full hover:bg-gray-200 transition-color"
          onClick={cancelEdit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </>
    )}
  </div>
);

export { DisplayName };
