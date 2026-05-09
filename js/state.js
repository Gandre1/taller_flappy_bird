/**
 * Game State Manager
 * 
 * Manages game states (START, PLAYING, GAME_OVER) and transitions.
 */

class GameStateManager {
    constructor(gameStates = { START: 'START', PLAYING: 'PLAYING', GAME_OVER: 'GAME_OVER' }) {
        this.gameStates = gameStates;
        this.currentState = gameStates.START;
        this.previousState = null;
        
        // State change callbacks
        this.stateChangeCallbacks = [];
        this.stateSpecificCallbacks = {
            [gameStates.START]: [],
            [gameStates.PLAYING]: [],
            [gameStates.GAME_OVER]: []
        };
        
        // State timers
        this.stateTimers = {
            [gameStates.START]: 0,
            [gameStates.PLAYING]: 0,
            [gameStates.GAME_OVER]: 0
        };
        
        // State entry time
        this.stateEntryTime = Date.now();
    }
    
    /**
     * Set current game state
     */
    setState(newState) {
        // Validate state
        if (!Object.values(this.gameStates).includes(newState)) {
            console.error(`Invalid game state: ${newState}`);
            return;
        }
        
        // Don't transition to same state
        if (newState === this.currentState) {
            return;
        }
        
        // Update state timers
        const now = Date.now();
        const timeInState = (now - this.stateEntryTime) / 1000; // Convert to seconds
        this.stateTimers[this.currentState] += timeInState;
        
        // Update state history
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateEntryTime = now;
        
        // Trigger callbacks
        this.triggerStateChangeCallbacks(newState, this.previousState);
        this.triggerStateSpecificCallbacks(newState);
        
        console.log(`Game state changed: ${this.previousState} -> ${newState}`);
    }
    
    /**
     * Get current game state
     */
    getState() {
        return this.currentState;
    }
    
    /**
     * Get previous game state
     */
    getPreviousState() {
        return this.previousState;
    }
    
    /**
     * Check if current state is START
     */
    isStart() {
        return this.currentState === this.gameStates.START;
    }
    
    /**
     * Check if current state is PLAYING
     */
    isPlaying() {
        return this.currentState === this.gameStates.PLAYING;
    }
    
    /**
     * Check if current state is GAME_OVER
     */
    isGameOver() {
        return this.currentState === this.gameStates.GAME_OVER;
    }
    
    /**
     * Get time spent in current state (in seconds)
     */
    getTimeInCurrentState() {
        const now = Date.now();
        return (now - this.stateEntryTime) / 1000;
    }
    
    /**
     * Get total time spent in a specific state (in seconds)
     */
    getTotalTimeInState(state) {
        return this.stateTimers[state] || 0;
    }
    
    /**
     * Register callback for any state change
     */
    onStateChange(callback) {
        this.stateChangeCallbacks.push(callback);
    }
    
    /**
     * Register callback for specific state entry
     */
    onStateEnter(state, callback) {
        if (this.stateSpecificCallbacks[state]) {
            this.stateSpecificCallbacks[state].push(callback);
        }
    }
    
    /**
     * Trigger state change callbacks
     */
    triggerStateChangeCallbacks(newState, previousState) {
        this.stateChangeCallbacks.forEach(callback => {
            callback(newState, previousState);
        });
    }
    
    /**
     * Trigger state-specific callbacks
     */
    triggerStateSpecificCallbacks(state) {
        const callbacks = this.stateSpecificCallbacks[state] || [];
        callbacks.forEach(callback => {
            callback(state);
        });
    }
    
    /**
     * Reset all state timers
     */
    resetTimers() {
        this.stateTimers = {
            [this.gameStates.START]: 0,
            [this.gameStates.PLAYING]: 0,
            [this.gameStates.GAME_OVER]: 0
        };
        this.stateEntryTime = Date.now();
    }
    
    /**
     * Get state machine definition
     */
    getStateMachine() {
        return {
            states: this.gameStates,
            currentState: this.currentState,
            previousState: this.previousState,
            validTransitions: {
                [this.gameStates.START]: [this.gameStates.PLAYING],
                [this.gameStates.PLAYING]: [this.gameStates.GAME_OVER],
                [this.gameStates.GAME_OVER]: [this.gameStates.START]
            },
            timers: this.stateTimers,
            timeInCurrentState: this.getTimeInCurrentState()
        };
    }
    
    /**
     * Validate state transition
     */
    isValidTransition(fromState, toState) {
        const validTransitions = {
            [this.gameStates.START]: [this.gameStates.PLAYING],
            [this.gameStates.PLAYING]: [this.gameStates.GAME_OVER],
            [this.gameStates.GAME_OVER]: [this.gameStates.START, this.gameStates.PLAYING]
        };
        
        return validTransitions[fromState]?.includes(toState) || false;
    }
    
    /**
     * Force state transition (for testing/debugging)
     */
    forceState(newState) {
        console.warn(`Forcing state transition to: ${newState}`);
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateEntryTime = Date.now();
        this.triggerStateChangeCallbacks(newState, this.previousState);
    }
    
    /**
     * Update state manager (called each frame)
     */
    update(deltaTime) {
        // Update state-specific logic if needed
        switch (this.currentState) {
            case this.gameStates.PLAYING:
                // Update playing state logic
                break;
                
            case this.gameStates.GAME_OVER:
                // Update game over state logic
                // Example: auto-restart after delay
                const timeInGameOver = this.getTimeInCurrentState();
                if (timeInGameOver > 5) { // Auto-restart after 5 seconds
                    this.setState(this.gameStates.START);
                }
                break;
        }
    }
    
    /**
     * Reset to initial state
     */
    reset() {
        this.currentState = this.gameStates.START;
        this.previousState = null;
        this.resetTimers();
        console.log('Game state manager reset to START');
    }
    
    /**
     * Test state transitions
     */
    testTransitions() {
        const testSequence = [
            { from: this.gameStates.START, to: this.gameStates.PLAYING, expected: true },
            { from: this.gameStates.PLAYING, to: this.gameStates.GAME_OVER, expected: true },
            { from: this.gameStates.GAME_OVER, to: this.gameStates.START, expected: true },
            { from: this.gameStates.START, to: this.gameStates.GAME_OVER, expected: false },
            { from: this.gameStates.PLAYING, to: this.gameStates.START, expected: false }
        ];
        
        const results = testSequence.map(test => {
            const isValid = this.isValidTransition(test.from, test.to);
            return {
                from: test.from,
                to: test.to,
                expected: test.expected,
                actual: isValid,
                passed: isValid === test.expected
            };
        });
        
        return {
            tests: results,
            currentState: this.currentState,
            stateMachine: this.getStateMachine()
        };
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStateManager;
}