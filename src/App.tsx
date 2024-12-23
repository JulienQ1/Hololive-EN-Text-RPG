import React, { useState } from 'react';
import { Gamepad2, Scroll, History } from 'lucide-react';
import { GameState } from './types/game';
import { HOLOLIVE_CHARACTERS } from './data/characters';
import { initializeLLM, generateText } from './utils/llm';
import { CharacterSelect } from './components/CharacterSelect';
import { GameHistory } from './components/GameHistory';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    maxRounds: 6,
    storyText: [],
    choices: [],
    isLoading: false,
    isGameStarted: false,
    selectedCharacter: '',
    gameHistory: [],
  });

  const [showHistory, setShowHistory] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const startGame = async () => {
    if (!gameState.selectedCharacter || !initialPrompt) {
      alert('Please select a character and enter an initial prompt!');
      return;
    }

    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await initializeLLM();
      
      const character = HOLOLIVE_CHARACTERS.find(c => c.id === gameState.selectedCharacter);
      const contextPrompt = `You are ${character?.name}, ${character?.description}. ${initialPrompt}`;
      
      const response = await generateText(
        contextPrompt,
        'You are a Hololive EN themed game master. Keep responses concise and entertaining.'
      );
      
      setGameState(prev => ({
        ...prev,
        isGameStarted: true,
        isLoading: false,
        storyText: [response],
        gameHistory: [contextPrompt, response],
      }));

      generateChoices();
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to initialize the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateChoices = async () => {
    try {
      const response = await generateText(
        'What are the next possible actions?',
        'Generate 3 distinct choices for the player.',
        { temperature: 0.8, max_tokens: 100 }
      );

      const choices = response
        .split('\n')
        .filter(choice => choice.trim())
        .slice(0, 3);

      setGameState(prev => ({ ...prev, choices }));
    } catch (error) {
      console.error('Failed to generate choices:', error);
      alert('Failed to generate choices. Please try refreshing the page.');
    }
  };

  const handleChoice = async (choice: string) => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const diceRoll = Math.floor(Math.random() * 20) + 1;
      const success = diceRoll >= 10;
      
      const consequence = await generateText(
        `The player chose: "${choice}". The dice roll was ${diceRoll} (${success ? 'success' : 'failure'}). What happens next?`,
        'You are a Hololive EN themed game master.'
      );

      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        storyText: [...prev.storyText, consequence],
        gameHistory: [...prev.gameHistory, choice, `Dice: ${diceRoll}`, consequence],
        isLoading: false,
      }));

      if (gameState.currentRound < gameState.maxRounds - 1) {
        generateChoices();
      } else {
        const ending = await generateText(
          'Create an epic conclusion to this adventure.',
          'You are a Hololive EN themed game master.'
        );
        setGameState(prev => ({
          ...prev,
          storyText: [...prev.storyText, ending],
          gameHistory: [...prev.gameHistory, ending],
          choices: [],
        }));
      }
    } catch (error) {
      console.error('Failed to process choice:', error);
      alert('Failed to process your choice. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Hololive EN Adventure</h1>
        
        {!gameState.isGameStarted ? (
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <CharacterSelect
              selectedCharacter={gameState.selectedCharacter}
              onSelect={(id) => setGameState(prev => ({ ...prev, selectedCharacter: id }))}
            />

            <div>
              <label className="block text-lg mb-2">Initial Prompt:</label>
              <textarea
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                className="w-full h-32 bg-gray-700 rounded-lg p-4 text-white"
                placeholder="Describe the starting situation..."
              />
            </div>

            <button
              onClick={startGame}
              disabled={gameState.isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Start Adventure
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Scroll className="w-5 h-5" />
                  <span>Round {gameState.currentRound + 1} of {gameState.maxRounds}</span>
                </div>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  <History className="w-5 h-5" />
                  History
                </button>
              </div>

              <div className="space-y-4">
                {gameState.storyText.map((text, i) => (
                  <p key={i} className="leading-relaxed">{text}</p>
                ))}
              </div>

              {gameState.isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                </div>
              )}

              {!gameState.isLoading && gameState.choices.length > 0 && (
                <div className="mt-6 space-y-3">
                  {gameState.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(choice)}
                      className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showHistory && (
              <GameHistory
                history={gameState.gameHistory}
                onClose={() => setShowHistory(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;