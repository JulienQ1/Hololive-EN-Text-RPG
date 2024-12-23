import React from 'react';
import { Character } from '../types/game';
import { HOLOLIVE_CHARACTERS } from '../data/characters';

interface Props {
  selectedCharacter: string;
  onSelect: (id: string) => void;
}

export const CharacterSelect: React.FC<Props> = ({ selectedCharacter, onSelect }) => {
  return (
    <div>
      <label className="block text-lg mb-2">Select Your Character:</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOLOLIVE_CHARACTERS.map(char => (
          <button
            key={char.id}
            onClick={() => onSelect(char.id)}
            className={`p-4 rounded-lg transition-colors ${
              selectedCharacter === char.id
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <h3 className="text-xl font-bold">{char.name}</h3>
            <p className="text-gray-300">{char.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};