export interface GameState {
  currentRound: number;
  maxRounds: number;
  storyText: string[];
  choices: string[];
  isLoading: boolean;
  isGameStarted: boolean;
  selectedCharacter: string;
  gameHistory: string[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
}