/**
 * Score Manager
 * 
 * Handles score tracking, high score persistence, and scoring logic.
 */

class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.scoredPipes = new Set(); // Track which pipes have been scored
        this.scoreCallbacks = [];
        
        // Score animation state
        this.scoreAnimation = {
            active: false,
            value: 0,
            position: { x: 0, y: 0 },
            time: 0,
            duration: 0.5 // seconds
        };
    }
    
    /**
     * Increment current score
     */
    increment(amount = 1) {
        this.currentScore += amount;
        
        // Cap score at maximum
        if (this.currentScore > 9999) {
            this.currentScore = 9999;
        }
        
        // Update high score if needed
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
        
        // Trigger score animation
        this.triggerScoreAnimation();
        
        // Notify listeners
        this.triggerScoreCallbacks();
        
        return this.currentScore;
    }
    
    /**
     * Reset current score for new game
     */
    reset() {
        this.currentScore = 0;
        this.scoredPipes.clear();
        this.scoreAnimation.active = false;
    }
    
    /**
     * Get current score
     */
    getCurrentScore() {
        return this.currentScore;
    }
    
    /**
     * Get high score
     */
    getHighScore() {
        return this.highScore;
    }
    
    /**
     * Mark a pipe as scored
     */
    markPipeScored(pipeId) {
        this.scoredPipes.add(pipeId);
    }
    
    /**
     * Check if a pipe has been scored
     */
    isPipeScored(pipeId) {
        return this.scoredPipes.has(pipeId);
    }
    
    /**
     * Load high score from localStorage
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem('flappyBirdHighScore');
            return saved ? parseInt(saved, 10) : 0;
        } catch (error) {
            console.warn('Failed to load high score from localStorage:', error);
            return 0;
        }
    }
    
    /**
     * Save high score to localStorage
     */
    saveHighScore() {
        try {
            localStorage.setItem('flappyBirdHighScore', this.highScore.toString());
        } catch (error) {
            console.warn('Failed to save high score to localStorage:', error);
        }
    }
    
    /**
     * Clear high score (for testing/reset)
     */
    clearHighScore() {
        this.highScore = 0;
        try {
            localStorage.removeItem('flappyBirdHighScore');
        } catch (error) {
            console.warn('Failed to clear high score from localStorage:', error);
        }
    }
    
    /**
     * Trigger score animation
     */
    triggerScoreAnimation() {
        this.scoreAnimation = {
            active: true,
            value: this.currentScore,
            position: { x: 400, y: 100 }, // Center of screen (will be updated by renderer)
            time: 0,
            duration: 0.5
        };
    }
    
    /**
     * Update score animation
     */
    updateAnimation(deltaTime) {
        if (!this.scoreAnimation.active) return;
        
        this.scoreAnimation.time += deltaTime;
        
        if (this.scoreAnimation.time >= this.scoreAnimation.duration) {
            this.scoreAnimation.active = false;
        }
    }
    
    /**
     * Draw score animation
     */
    drawAnimation(ctx) {
        if (!this.scoreAnimation.active || !ctx) return;
        
        const anim = this.scoreAnimation;
        const progress = anim.time / anim.duration;
        
        // Calculate animation properties
        const scale = 1 + progress * 0.5; // Grow then shrink
        const alpha = 1 - progress; // Fade out
        const yOffset = -50 * progress; // Move upward
        
        ctx.save();
        ctx.translate(anim.position.x, anim.position.y + yOffset);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        
        // Draw animated score
        ctx.font = 'bold 48px "Press Start 2P", monospace';
        ctx.fillStyle = '#4a90e2';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+' + (anim.value - (anim.value - 1)), 0, 0);
        
        ctx.restore();
    }
    
    /**
     * Register score callback
     */
    onScore(callback) {
        this.scoreCallbacks.push(callback);
    }
    
    /**
     * Trigger score callbacks
     */
    triggerScoreCallbacks() {
        this.scoreCallbacks.forEach(callback => {
            callback(this.currentScore);
        });
    }
    
    /**
     * Clear all callbacks
     */
    clearCallbacks() {
        this.scoreCallbacks = [];
    }
    
    /**
     * Get score statistics
     */
    getStats() {
        return {
            currentScore: this.currentScore,
            highScore: this.highScore,
            scoredPipes: this.scoredPipes.size,
            hasNewHighScore: this.currentScore > this.highScore
        };
    }
    
    /**
     * Format score with leading zeros
     */
    formatScore(score, digits = 4) {
        return score.toString().padStart(digits, '0');
    }
    
    /**
     * Test scoring logic
     */
    testScoring() {
        const testCases = [
            { pipeId: 1, expected: true },
            { pipeId: 2, expected: true },
            { pipeId: 1, expected: false }, // Duplicate should not score
            { pipeId: 3, expected: true }
        ];
        
        const results = testCases.map(test => {
            const wasScored = this.isPipeScored(test.pipeId);
            if (!wasScored) {
                this.markPipeScored(test.pipeId);
            }
            return {
                pipeId: test.pipeId,
                expected: test.expected,
                actual: !wasScored,
                passed: (!wasScored) === test.expected
            };
        });
        
        return {
            tests: results,
            currentScore: this.currentScore,
            highScore: this.highScore
        };
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreManager;
}