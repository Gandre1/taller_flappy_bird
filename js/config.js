/**
 * Flappy Bird Game Configuration
 * 
 * This file contains all game settings and configuration values.
 * Based on the design document specifications.
 */

const GameConfig = {
    // Canvas settings
    canvas: {
        width: 800,
        height: 600,
        backgroundColor: '#70c5ce', // Sky blue
        groundColor: '#ded895',     // Sand/tan
        pipeColor: '#73bf2e',       // Green
        birdColor: '#f2d22e',       // Yellow
        textColor: '#333333',       // Dark gray
        uiColor: '#4a90e2'          // Blue accent
    },
    
    // Bird settings
    bird: {
        startX: 100,
        startY: 300,
        width: 34,
        height: 24,
        gravity: 0.5,
        jumpForce: -10,
        maxVelocity: 15,
        animationFrames: 3,
        animationSpeed: 0.15,
        color: '#f2d22e',
        wingColor: '#ff9800',
        eyeColor: '#333333'
    },
    
    // Pipe settings
    pipes: {
        width: 52,
        gapHeight: 150,
        minPipeHeight: 50,
        maxPipeHeight: 350,
        speed: 2,
        spawnInterval: 1500, // milliseconds
        maxPipes: 5,
        color: '#73bf2e',
        capWidth: 60,
        capHeight: 20
    },
    
    // Game settings
    game: {
        groundHeight: 112,
        ceilingHeight: 0,
        fps: 60,
        scoreIncrement: 1,
        maxScore: 9999,
        gameStates: {
            START: 'START',
            PLAYING: 'PLAYING', 
            GAME_OVER: 'GAME_OVER'
        }
    },
    
    // Physics settings
    physics: {
        gravity: 0.5,
        jumpForce: -10,
        maxVelocity: 15,
        damping: 0.99,
        deltaTimeScale: 1.0
    },
    
    // Input settings
    input: {
        jumpKeys: [' ', 'Spacebar', 'ArrowUp', 'KeyW'],
        restartKeys: ['Enter', 'KeyR'],
        touchCooldown: 100, // milliseconds
        inputCooldown: 100   // milliseconds
    },
    
    // Sound settings (optional)
    sound: {
        enabled: true,
        volume: 0.5,
        jumpSound: 'assets/sounds/jump.mp3',
        scoreSound: 'assets/sounds/score.mp3',
        collisionSound: 'assets/sounds/collision.mp3',
        backgroundMusic: 'assets/sounds/background.mp3'
    },
    
    // UI settings
    ui: {
        scoreFont: '28px "Press Start 2P", monospace',
        titleFont: '48px "Press Start 2P", monospace',
        textFont: '20px Arial, sans-serif',
        instructionFont: '16px Arial, sans-serif',
        scorePosition: { x: 20, y: 40 },
        highScorePosition: { x: 20, y: 70 }
    },
    
    // Responsive design settings
    responsive: {
        breakpoints: {
            desktop: 800,
            tablet: 600,
            mobile: 320
        },
        scaleFactors: {
            desktop: 1.0,
            tablet: 0.8,
            mobile: 0.6
        },
        touchTargetSize: 44 // Minimum touch target size in pixels
    },
    
    // Performance settings
    performance: {
        targetFPS: 60,
        minFPS: 30,
        frameTimeBudget: 16.67, // milliseconds for 60 FPS
        objectPoolSize: 10,
        enableObjectPooling: true
    },
    
    // Debug settings
    debug: {
        enabled: false,
        showFPS: false,
        showBounds: false,
        showCollisionBoxes: false,
        logPhysics: false,
        logInput: false
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
}