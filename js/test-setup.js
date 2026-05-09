/**
 * Test Setup for Flappy Bird Game
 * 
 * This file tests that all modules can be loaded and basic functionality works.
 */

console.log('=== Flappy Bird Game Test Setup ===');

// Test 1: Check if config is loaded
console.log('Test 1: Checking configuration...');
if (typeof GameConfig !== 'undefined') {
    console.log('✓ Configuration loaded successfully');
    console.log('  Canvas dimensions:', GameConfig.canvas.width, 'x', GameConfig.canvas.height);
    console.log('  Game states:', GameConfig.game.gameStates);
} else {
    console.error('✗ Configuration not loaded');
}

// Test 2: Check if modules are defined
console.log('\nTest 2: Checking module definitions...');
const modules = [
    'GameEngine',
    'GameStateManager', 
    'InputHandler',
    'Bird',
    'PipeManager',
    'CollisionDetector',
    'ScoreManager',
    'Renderer',
    'SoundManager'
];

let allModulesLoaded = true;
modules.forEach(moduleName => {
    try {
        // Check if module is defined in global scope
        if (eval(`typeof ${moduleName}`) === 'function') {
            console.log(`  ✓ ${moduleName} is defined`);
        } else {
            console.log(`  ✗ ${moduleName} is not defined`);
            allModulesLoaded = false;
        }
    } catch (error) {
        console.log(`  ✗ ${moduleName} check failed:`, error.message);
        allModulesLoaded = false;
    }
});

// Test 3: Check canvas element
console.log('\nTest 3: Checking canvas element...');
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    console.log('✓ Canvas element found');
    console.log('  Dimensions:', canvas.width, 'x', canvas.height);
    
    // Check canvas context
    const ctx = canvas.getContext('2d');
    if (ctx) {
        console.log('✓ Canvas context available');
    } else {
        console.error('✗ Canvas context not available');
        allModulesLoaded = false;
    }
} else {
    console.error('✗ Canvas element not found');
    allModulesLoaded = false;
}

// Test 4: Check CSS loading
console.log('\nTest 4: Checking CSS styles...');
const stylesheets = Array.from(document.styleSheets);
const gameStyles = stylesheets.find(sheet => 
    sheet.href && sheet.href.includes('style.css')
);

if (gameStyles) {
    console.log('✓ Game stylesheet loaded');
} else {
    console.warn('⚠ Game stylesheet may not be loaded');
}

// Test 5: Check responsive design
console.log('\nTest 5: Checking responsive design...');
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta && viewportMeta.content.includes('width=device-width')) {
    console.log('✓ Responsive viewport meta tag found');
} else {
    console.warn('⚠ Responsive viewport meta tag may be missing');
}

// Test 6: Check font loading
console.log('\nTest 6: Checking font loading...');
const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .filter(link => link.href.includes('fonts.googleapis.com'));
    
if (fontLinks.length > 0) {
    console.log('✓ Google Fonts loaded');
} else {
    console.warn('⚠ Google Fonts may not be loaded');
}

// Summary
console.log('\n=== Test Summary ===');
if (allModulesLoaded) {
    console.log('✅ All tests passed! Game structure is properly set up.');
    console.log('\nNext steps:');
    console.log('1. Open the browser console to see game logs');
    console.log('2. Click on the canvas or press SPACE to start the game');
    console.log('3. The bird should respond to input and gravity');
    console.log('4. Pipes should generate and move from right to left');
} else {
    console.log('❌ Some tests failed. Check the errors above.');
    console.log('\nTroubleshooting:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Verify all JS files are in the js/ directory');
    console.log('3. Check file permissions and paths');
}

// Initialize game if everything looks good
if (allModulesLoaded && canvas) {
    console.log('\n=== Initializing Game ===');
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeGame();
        });
    } else {
        initializeGame();
    }
}

function initializeGame() {
    try {
        console.log('Creating game engine instance...');
        window.game = new GameEngine(canvas);
        
        console.log('Starting game engine...');
        window.game.start();
        
        console.log('✅ Game initialized successfully!');
        console.log('Game controls:');
        console.log('  - SPACE, CLICK, or TAP: Make bird jump');
        console.log('  - R or ENTER: Restart game');
        console.log('  - Check browser console for debug info');
        
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        console.error('Error stack:', error.stack);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testSetup: allModulesLoaded,
        modules: modules.reduce((acc, moduleName) => {
            try {
                acc[moduleName] = eval(`typeof ${moduleName}`) === 'function';
            } catch (error) {
                acc[moduleName] = false;
            }
            return acc;
        }, {})
    };
}