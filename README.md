# Flappy Bird Game

A Flappy Bird style game implemented using HTML5 Canvas, CSS, and vanilla JavaScript.

## Project Structure

```
flappy-bird-game/
├── index.html              # Main HTML file with canvas element
├── css/
│   └── style.css          # Responsive design and styling
├── js/
│   ├── config.js          # Game configuration and settings
│   ├── game.js            # Main game engine and entry point
│   ├── bird.js            # Bird physics and controls
│   ├── pipe.js            # Pipe generation and management
│   ├── collision.js       # Collision detection system
│   ├── renderer.js        # Canvas rendering and UI
│   ├── score.js           # Score tracking and persistence
│   ├── input.js           # Input handling (keyboard, mouse, touch)
│   ├── state.js           # Game state management
│   ├── sound.js           # Sound effects (optional)
│   └── test-setup.js      # Setup verification
├── assets/
│   ├── images/            # Game sprites and images
│   └── sounds/            # Sound effects
├── package.json           # Dependencies and scripts
└── babel.config.js        # Babel configuration for testing
```

## Features

- **HTML5 Canvas Rendering**: Smooth 60 FPS animation using `requestAnimationFrame`
- **Responsive Design**: Adapts to different screen sizes and devices
- **Physics Engine**: Realistic gravity and jump mechanics
- **Collision Detection**: Efficient bounding box collision detection
- **Score System**: Tracks current score and high score with localStorage persistence
- **Input Handling**: Supports keyboard (SPACE), mouse click, and touch input
- **Game States**: START, PLAYING, and GAME_OVER states with proper transitions
- **Sound Effects**: Optional sound system with graceful degradation
- **Modular Architecture**: Clean separation of concerns with well-defined interfaces

## Requirements Met

This implementation satisfies the following requirements from the spec:

### Requirement 1: Game Initialization and Structure
- ✓ Uses `requestAnimationFrame` for game loop
- ✓ Separates HTML, CSS, and JavaScript into distinct files
- ✓ Uses HTML5 Canvas for game rendering
- ✓ Implements basic responsive design for mobile devices

### Requirement 10: Code Quality and Structure
- ✓ Follows JavaScript best practices and coding standards
- ✓ Uses meaningful variable and function names
- ✓ Includes appropriate code comments for complex logic
- ✓ Separates concerns into logical modules
- ✓ Handles errors gracefully

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game
1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser to `http://localhost:3000`
3. The game will automatically initialize

### Controls
- **SPACEBAR**: Make the bird jump
- **MOUSE CLICK**: Make the bird jump
- **TOUCH**: Make the bird jump (mobile devices)
- **R or ENTER**: Restart game (when game over)

### Testing
Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Game Architecture

### Core Components

1. **GameEngine** (`game.js`): Main orchestrator, manages game loop and subsystems
2. **Bird** (`bird.js`): Player character with physics and animation
3. **PipeManager** (`pipe.js`): Generates and manages pipe obstacles
4. **CollisionDetector** (`collision.js`): Handles collision detection
5. **Renderer** (`renderer.js`): Draws all game elements to canvas
6. **ScoreManager** (`score.js`): Tracks scores and high scores
7. **InputHandler** (`input.js`): Processes user input
8. **GameStateManager** (`state.js`): Manages game states and transitions
9. **SoundManager** (`sound.js`): Optional sound effects

### Configuration

All game settings are centralized in `js/config.js`, including:
- Canvas dimensions and colors
- Bird physics parameters (gravity, jump force)
- Pipe generation settings (gap height, spawn interval)
- Game rules (ground height, scoring)
- Input configuration
- Sound settings
- Performance targets

## Development

### Adding New Features
1. Follow the modular architecture pattern
2. Add configuration options to `config.js`
3. Update relevant subsystems
4. Add tests for new functionality
5. Update documentation

### Testing Strategy
- **Unit Tests**: Test individual components in isolation
- **Property-Based Tests**: Verify universal properties across all inputs
- **Integration Tests**: Test component interactions
- **Performance Tests**: Ensure frame rate targets are met

### Code Style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow consistent indentation (2 spaces)
- Handle errors gracefully with appropriate fallbacks

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile Safari 11+
- Chrome for Android 60+

## Performance Targets

- Minimum 30 FPS on all supported devices
- Responsive input handling (< 100ms latency)
- Efficient memory usage with object pooling
- Graceful degradation for unsupported features

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Based on the original Flappy Bird game by Dong Nguyen
- Built with vanilla JavaScript for educational purposes
- Designed with clean architecture and maintainability in mind