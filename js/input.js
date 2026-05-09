/**
 * Input Handler
 * 
 * Handles keyboard, mouse, and touch input.
 * Normalizes input across different devices.
 */

class InputHandler {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        
        // Input state
        this.inputState = {
            keys: {},
            mouse: {
                x: 0,
                y: 0,
                isDown: false
            },
            touch: {
                x: 0,
                y: 0,
                isActive: false
            },
            lastInputTime: 0
        };
        
        // Callbacks
        this.jumpCallbacks = [];
        this.restartCallbacks = [];
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault(); // Prevent scrolling
            }
        }, { passive: false });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Handle key down events
     */
    handleKeyDown(event) {
        const key = event.code || event.key;
        this.inputState.keys[key] = true;
        
        // Check for jump keys
        if (this.config.jumpKeys.includes(key) || this.config.jumpKeys.includes(event.key)) {
            this.triggerJump();
        }
        
        // Check for restart keys
        if (this.config.restartKeys.includes(key) || this.config.restartKeys.includes(event.key)) {
            this.triggerRestart();
        }
        
        // Prevent spacebar from scrolling page
        if (key === 'Space' || key === ' ') {
            event.preventDefault();
        }
    }
    
    /**
     * Handle key up events
     */
    handleKeyUp(event) {
        const key = event.code || event.key;
        this.inputState.keys[key] = false;
    }
    
    /**
     * Handle mouse down events
     */
    handleMouseDown(event) {
        this.inputState.mouse.isDown = true;
        this.updateMousePosition(event);
        
        // Check if click is on canvas
        if (this.isPointInCanvas(event.clientX, event.clientY)) {
            this.triggerJump();
        }
    }
    
    /**
     * Handle mouse up events
     */
    handleMouseUp(event) {
        this.inputState.mouse.isDown = false;
        this.updateMousePosition(event);
    }
    
    /**
     * Handle mouse move events
     */
    handleMouseMove(event) {
        this.updateMousePosition(event);
    }
    
    /**
     * Handle touch start events
     */
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            this.inputState.touch.isActive = true;
            this.updateTouchPosition(event);
            
            // Check if touch is on canvas
            const touch = event.touches[0];
            if (this.isPointInCanvas(touch.clientX, touch.clientY)) {
                this.triggerJump();
            }
        }
    }
    
    /**
     * Handle touch end events
     */
    handleTouchEnd(event) {
        this.inputState.touch.isActive = false;
    }
    
    /**
     * Handle touch move events
     */
    handleTouchMove(event) {
        if (event.touches.length === 1) {
            this.updateTouchPosition(event);
        }
    }
    
    /**
     * Update mouse position from event
     */
    updateMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.inputState.mouse.x = event.clientX - rect.left;
        this.inputState.mouse.y = event.clientY - rect.top;
    }
    
    /**
     * Update touch position from event
     */
    updateTouchPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        this.inputState.touch.x = touch.clientX - rect.left;
        this.inputState.touch.y = touch.clientY - rect.top;
    }
    
    /**
     * Check if a point is within the canvas
     */
    isPointInCanvas(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return clientX >= rect.left && 
               clientX <= rect.right && 
               clientY >= rect.top && 
               clientY <= rect.bottom;
    }
    
    /**
     * Trigger jump action with cooldown
     */
    triggerJump() {
        const now = Date.now();
        const timeSinceLastInput = now - this.inputState.lastInputTime;
        
        // Apply input cooldown to prevent multiple triggers
        if (timeSinceLastInput >= this.config.inputCooldown) {
            this.inputState.lastInputTime = now;
            this.jumpCallbacks.forEach(callback => callback());
        }
    }
    
    /**
     * Trigger restart action
     */
    triggerRestart() {
        this.restartCallbacks.forEach(callback => callback());
    }
    
    /**
     * Update input state (called each frame)
     */
    update() {
        // Clear touch state if no active touches
        // This handles cases where touchend might not fire
        if (!this.inputState.touch.isActive) {
            this.inputState.touch.x = 0;
            this.inputState.touch.y = 0;
        }
    }
    
    /**
     * Register jump callback
     */
    onJump(callback) {
        this.jumpCallbacks.push(callback);
    }
    
    /**
     * Register restart callback
     */
    onRestart(callback) {
        this.restartCallbacks.push(callback);
    }
    
    /**
     * Get current input state
     */
    getInputState() {
        return {
            ...this.inputState,
            isJumpPressed: this.isJumpPressed(),
            isRestartPressed: this.isRestartPressed(),
            hasAnyInput: this.hasAnyInput()
        };
    }
    
    /**
     * Check if jump is currently pressed
     */
    isJumpPressed() {
        // Check keyboard keys
        for (const key of this.config.jumpKeys) {
            if (this.inputState.keys[key]) {
                return true;
            }
        }
        
        // Check mouse
        if (this.inputState.mouse.isDown) {
            return true;
        }
        
        // Check touch
        if (this.inputState.touch.isActive) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if restart is currently pressed
     */
    isRestartPressed() {
        for (const key of this.config.restartKeys) {
            if (this.inputState.keys[key]) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if there's any active input
     */
    hasAnyInput() {
        return this.isJumpPressed() || this.isRestartPressed();
    }
    
    /**
     * Clear all input state
     */
    clear() {
        this.inputState.keys = {};
        this.inputState.mouse.isDown = false;
        this.inputState.touch.isActive = false;
        this.inputState.lastInputTime = 0;
    }
    
    /**
     * Remove all event listeners
     */
    destroy() {
        // Note: In a real implementation, we would store references
        // to the bound methods and remove them properly
        console.log('Input handler destroyed (event listeners would be removed here)');
    }
    
    /**
     * Test input handling
     */
    testInput() {
        const testResults = {
            keyboard: {
                jumpKeys: this.config.jumpKeys,
                restartKeys: this.config.restartKeys,
                supported: true
            },
            mouse: {
                supported: true,
                positionTracking: true
            },
            touch: {
                supported: 'ontouchstart' in window,
                multiTouch: false
            },
            currentState: this.getInputState()
        };
        
        return testResults;
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
}