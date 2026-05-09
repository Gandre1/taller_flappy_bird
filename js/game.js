/**
 * Flappy Bird Game Engine
 * 
 * Main game engine that orchestrates all subsystems.
 * Uses requestAnimationFrame for smooth animation.
 */

// Import configuration
const config = window.GameConfig || {};

class GameEngine {
    constructor(canvasElement, customConfig = {}) {
        // Merge custom config with default
        this.config = { ...config, ...customConfig };
        
        // Canvas setup
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize canvas dimensions
        this.resizeCanvas();
        
        // Game state
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        this.gameTime = 0;
        
        // Initialize subsystems
        this.initializeSubsystems();
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Initialize all game subsystems
     */
    initializeSubsystems() {
        // Game State Manager
        this.stateManager = new GameStateManager(this.config.game.gameStates);
        
        // Input Handler
        this.inputHandler = new InputHandler(this.canvas, this.config.input);
        
        // Bird
        this.bird = new Bird(this.config.bird);
        
        // Pipe Manager
        this.pipeManager = new PipeManager(this.config.pipes);
        
        // Collision Detector
        this.collisionDetector = new CollisionDetector();
        
        // Score Manager
        this.scoreManager = new ScoreManager();
        
        // Renderer
        this.renderer = new Renderer(this.canvas, this.ctx, this.config);
        
        // Sound Manager (optional)
        if (this.config.sound.enabled) {
            this.soundManager = new SoundManager(this.config.sound);
        }
        
        // Connect event handlers
        this.connectEventHandlers();
    }
    
    /**
     * Connect event handlers between subsystems
     */
    connectEventHandlers() {
        // Input -> Bird jump
        this.inputHandler.onJump(() => {
            if (this.stateManager.isPlaying()) {
                this.bird.jump();
                if (this.soundManager) {
                    this.soundManager.playJump();
                }
            } else if (this.stateManager.isStart()) {
                this.stateManager.setState(this.config.game.gameStates.PLAYING);
            } else if (this.stateManager.isGameOver()) {
                this.reset();
                this.stateManager.setState(this.config.game.gameStates.PLAYING);
            }
        });
        
        // Collision -> Game State
        this.collisionDetector.onCollision(() => {
            if (this.stateManager.isPlaying()) {
                this.stateManager.setState(this.config.game.gameStates.GAME_OVER);
                if (this.soundManager) {
                    this.soundManager.playCollision();
                }
            }
        });
        
        // Score -> Sound
        this.scoreManager.onScore(() => {
            if (this.soundManager) {
                this.soundManager.playScore();
            }
        });
        
        // State changes -> UI updates
        this.stateManager.onStateChange((newState) => {
            // Update UI based on state
            this.updateUIForState(newState);
        });
    }
    
    /**
     * Start the game engine
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.gameTime = 0;
        
        // Start in START state
        this.stateManager.setState(this.config.game.gameStates.START);
        
        // Start game loop
        requestAnimationFrame(this.gameLoop);
        
        console.log('Game engine started');
    }
    
    /**
     * Stop the game engine
     */
    stop() {
        this.isRunning = false;
        console.log('Game engine stopped');
    }
    
    /**
     * Reset game to initial state
     */
    reset() {
        this.bird.reset();
        this.pipeManager.reset();
        this.scoreManager.reset();
        this.gameTime = 0;
        this.frameCount = 0;
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;
        
        // Cap delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 0.1);
        
        // Update game time
        this.gameTime += this.deltaTime;
        this.frameCount++;
        
        // Process input
        this.inputHandler.update();
        
        // Update game state based on current state
        if (this.stateManager.isPlaying()) {
            this.updatePlayingState();
        }
        
        // Render current frame
        this.render();
        
        // Request next frame
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * Update game during PLAYING state
     */
    updatePlayingState() {
        // Update bird physics
        this.bird.update(this.deltaTime);
        
        // Update pipes
        this.pipeManager.update(this.deltaTime, this.canvas.width, this.canvas.height);
        
        // Check collisions
        const pipes = this.pipeManager.getPipes();
        const groundY = this.canvas.height - this.config.game.groundHeight;
        
        // Check bird collisions
        const hasCollision = this.collisionDetector.checkCollisions(
            this.bird,
            pipes,
            groundY,
            this.config.game.ceilingHeight
        );
        
        if (hasCollision) {
            this.stateManager.setState(this.config.game.gameStates.GAME_OVER);
            return;
        }
        
        // Check for scoring
        const scoredPipe = this.collisionDetector.checkScoring(this.bird, pipes);
        if (scoredPipe && !this.scoreManager.isPipeScored(scoredPipe.id)) {
            this.scoreManager.increment();
            this.scoreManager.markPipeScored(scoredPipe.id);
        }
    }
    
    /**
     * Render current frame
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.renderer.drawBackground();
        
        // Draw game objects
        this.renderer.drawPipes(this.pipeManager.getPipes());
        this.renderer.drawBird(this.bird);
        this.renderer.drawGround();
        
        // Draw UI based on game state
        const currentState = this.stateManager.getState();
        const score = this.scoreManager.getCurrentScore();
        const highScore = this.scoreManager.getHighScore();
        
        switch (currentState) {
            case this.config.game.gameStates.START:
                this.renderer.drawStartScreen(highScore);
                break;
            case this.config.game.gameStates.PLAYING:
                this.renderer.drawScore(score, highScore);
                break;
            case this.config.game.gameStates.GAME_OVER:
                this.renderer.drawGameOverScreen(score, highScore);
                break;
        }
        
        // Draw debug info if enabled
        if (this.config.debug.enabled) {
            this.renderDebugInfo();
        }
    }
    
    /**
     * Render debug information
     */
    renderDebugInfo() {
        const ctx = this.ctx;
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        
        const debugLines = [
            `FPS: ${Math.round(1 / this.deltaTime)}`,
            `Frame: ${this.frameCount}`,
            `Time: ${this.gameTime.toFixed(1)}s`,
            `State: ${this.stateManager.getState()}`,
            `Score: ${this.scoreManager.getCurrentScore()}`,
            `Bird: (${this.bird.x.toFixed(0)}, ${this.bird.y.toFixed(0)})`,
            `Velocity: ${this.bird.velocityY.toFixed(1)}`,
            `Pipes: ${this.pipeManager.getPipes().length}`
        ];
        
        debugLines.forEach((line, index) => {
            ctx.fillText(line, 10, 20 + index * 15);
        });
        
        if (this.config.debug.showBounds) {
            // Draw bird bounds
            const bounds = this.bird.getBounds();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            
            // Draw pipe bounds
            this.pipeManager.getPipes().forEach(pipe => {
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
                ctx.strokeRect(pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
            });
        }
    }
    
    /**
     * Update UI based on game state
     */
    updateUIForState(state) {
        // This would typically update DOM elements
        // For now, we'll just log the state change
        console.log(`Game state changed to: ${state}`);
    }
    
    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Calculate scale factor
        const scaleX = containerWidth / this.config.canvas.width;
        const scaleY = containerHeight / this.config.canvas.height;
        const scale = Math.min(scaleX, scaleY);
        
        // Set canvas dimensions
        this.canvas.width = this.config.canvas.width * scale;
        this.canvas.height = this.config.canvas.height * scale;
        
        // Update renderer scale if it exists
        if (this.renderer) {
            this.renderer.setScale(scale);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.resizeCanvas();
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', this.handleResize);
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.handleResize);
        
        // Clean up subsystems
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }
        
        if (this.soundManager) {
            this.soundManager.destroy();
        }
        
        console.log('Game engine destroyed');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        window.game = new GameEngine(canvas);
        window.game.start();
    } else {
        console.error('Canvas element not found');
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}