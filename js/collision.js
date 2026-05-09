/**
 * Collision Detector
 * 
 * Handles collision detection between game objects.
 * Uses efficient bounding box detection.
 */

class CollisionDetector {
    constructor() {
        this.collisionCallbacks = [];
        this.scoringCallbacks = [];
    }
    
    /**
     * Check all collisions for a bird
     */
    checkCollisions(bird, pipes, groundY, ceilingY = 0) {
        const birdBounds = bird.getBounds();
        
        // Check ground collision
        if (this.checkGroundCollision(birdBounds, groundY)) {
            this.triggerCollision('ground');
            return true;
        }
        
        // Check ceiling collision
        if (this.checkCeilingCollision(birdBounds, ceilingY)) {
            this.triggerCollision('ceiling');
            return true;
        }
        
        // Check pipe collisions
        for (const pipe of pipes) {
            if (this.checkPipeCollision(birdBounds, pipe)) {
                this.triggerCollision('pipe');
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check if bird has passed through a pipe gap for scoring
     */
    checkScoring(bird, pipes) {
        const birdBounds = bird.getBounds();
        
        for (const pipe of pipes) {
            if (!pipe.isScored && this.checkPipeScored(birdBounds, pipe)) {
                this.triggerScoring(pipe);
                return pipe;
            }
        }
        
        return null;
    }
    
    /**
     * Check ground collision
     */
    checkGroundCollision(birdBounds, groundY) {
        return birdBounds.y + birdBounds.height >= groundY;
    }
    
    /**
     * Check ceiling collision
     */
    checkCeilingCollision(birdBounds, ceilingY) {
        return birdBounds.y <= ceilingY;
    }
    
    /**
     * Check pipe collision using bounding boxes
     */
    checkPipeCollision(birdBounds, pipe) {
        // Check collision with top pipe
        if (this.rectIntersect(birdBounds, pipe.top)) {
            return true;
        }
        
        // Check collision with bottom pipe
        if (this.rectIntersect(birdBounds, pipe.bottom)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if bird has passed through pipe gap
     */
    checkPipeScored(birdBounds, pipe) {
        // Bird must be completely past the left edge of the pipe gap
        // and must have passed through the gap (not above or below)
        if (birdBounds.x > pipe.gap.x + pipe.gap.width) {
            // Check if bird was within gap vertically when passing
            const birdCenterY = birdBounds.y + birdBounds.height / 2;
            return birdCenterY > pipe.gap.y && birdCenterY < pipe.gap.y + pipe.gap.height;
        }
        
        return false;
    }
    
    /**
     * Check if two rectangles intersect
     */
    rectIntersect(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    /**
     * Check if a point is inside a rectangle
     */
    pointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }
    
    /**
     * Get intersection area between two rectangles
     */
    getIntersectionArea(rect1, rect2) {
        const xOverlap = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
        const yOverlap = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
        return xOverlap * yOverlap;
    }
    
    /**
     * Trigger collision callbacks
     */
    triggerCollision(type) {
        this.collisionCallbacks.forEach(callback => {
            callback(type);
        });
    }
    
    /**
     * Trigger scoring callbacks
     */
    triggerScoring(pipe) {
        this.scoringCallbacks.forEach(callback => {
            callback(pipe);
        });
    }
    
    /**
     * Register collision callback
     */
    onCollision(callback) {
        this.collisionCallbacks.push(callback);
    }
    
    /**
     * Register scoring callback
     */
    onScore(callback) {
        this.scoringCallbacks.push(callback);
    }
    
    /**
     * Clear all callbacks
     */
    clearCallbacks() {
        this.collisionCallbacks = [];
        this.scoringCallbacks = [];
    }
    
    /**
     * Test collision detection with sample data
     */
    testCollision() {
        const testBird = { x: 100, y: 100, width: 30, height: 20 };
        const testPipe = {
            top: { x: 150, y: 0, width: 50, height: 100 },
            bottom: { x: 150, y: 200, width: 50, height: 100 }
        };
        
        const collision = this.rectIntersect(testBird, testPipe.top) || 
                         this.rectIntersect(testBird, testPipe.bottom);
        
        return {
            bird: testBird,
            pipe: testPipe,
            collision: collision,
            method: 'bounding-box'
        };
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionDetector;
}