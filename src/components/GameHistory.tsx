import React from 'react';

interface Props {
  history: string[];
  onClose: () => void;
}

export const GameHistory: React.FC<Props> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Adventure History</h2>
        <div className="space-y-2">
          {history.map((entry, i) => (
            <p key={i} className="border-l-4 border-blue-600 pl-4 py-2">{entry}</p>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};