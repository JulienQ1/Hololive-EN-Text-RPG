# Hololive EN Text RPG

A text-based RPG game featuring Hololive EN characters, powered by WebLLM for dynamic storytelling.

## Features

- Character selection from Hololive EN members
- Dynamic story generation using WebLLM
- Dice-roll based success/failure system
- Adventure history tracking
- Responsive UI with Tailwind CSS

## Project Structure

```
src/
├── components/           # React components
│   ├── CharacterSelect  # Character selection UI
│   └── GameHistory      # Game history modal
├── data/                # Static data
│   └── characters      # Hololive character definitions
├── types/               # TypeScript types
│   └── game           # Game-related interfaces
├── utils/              # Utility functions
│   └── llm            # WebLLM integration
└── App.tsx             # Main application component
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## How to Play

1. Select a Hololive EN character
2. Enter an initial story prompt
3. Make choices as the story progresses
4. Roll virtual dice to determine success/failure
5. View your adventure history at any time

## Technology Stack

- React + TypeScript
- Tailwind CSS for styling
- WebLLM for story generation
- Lucide React for icons
- Vite for development and building