/**
 * Pipe Manager
 * 
 * Handles pipe generation, movement, and management.
 */

class PipeManager {
    constructor(config) {
        this.config = config;
        
        // Pipe storage
        this.pipes = [];
        this.nextPipeId = 0;
        
        // Spawn timing
        this.lastSpawnTime = 0;
        this.spawnTimer = 0;
        
        // Performance optimization
        this.activePipeCount = 0;
    }
    
    /**
     * Update all pipes and spawn new ones if needed
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        // Update spawn timer
        this.spawnTimer += deltaTime * 1000; // Convert to milliseconds
        
        // Spawn new pipe if interval has passed and we're under max pipes
        if (this.spawnTimer - this.lastSpawnTime >= this.config.spawnInterval && 
            this.pipes.length < this.config.maxPipes) {
            this.spawnPipe(canvasHeight);
            this.lastSpawnTime = this.spawnTimer;
        }
        
        // Update and remove off-screen pipes
        this.updatePipes(deltaTime, canvasWidth);
    }
    
    /**
     * Spawn a new pipe pair
     */
    spawnPipe(canvasHeight) {
        const groundHeight = 112; // From config
        const availableHeight = canvasHeight - groundHeight;
        
        // Calculate gap position (random within constraints)
        const minGapY = this.config.minPipeHeight;
        const maxGapY = availableHeight - this.config.gapHeight - this.config.minPipeHeight;
        const gapY = minGapY + Math.random() * (maxGapY - minGapY);
        
        // Calculate pipe heights
        const topHeight = gapY;
        const bottomHeight = availableHeight - gapY - this.config.gapHeight;
        
        // Create pipe pair
        const pipe = {
            id: this.nextPipeId++,
            x: canvasWidth,
            top: {
                x: canvasWidth,
                y: 0,
                width: this.config.width,
                height: topHeight
            },
            bottom: {
                x: canvasWidth,
                y: gapY + this.config.gapHeight,
                width: this.config.width,
                height: bottomHeight
            },
            gap: {
                x: canvasWidth,
                y: gapY,
                width: this.config.width,
                height: this.config.gapHeight
            },
            isScored: false,
            isActive: true
        };
        
        this.pipes.push(pipe);
        this.activePipeCount++;
        
        return pipe;
    }
    
    /**
     * Update pipe positions and remove off-screen pipes
     */
    updatePipes(deltaTime, canvasWidth) {
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            
            if (!pipe.isActive) {
                // Remove inactive pipes
                this.pipes.splice(i, 1);
                this.activePipeCount--;
                continue;
            }
            
            // Update pipe position
            pipe.x -= this.config.speed * deltaTime * 60; // Normalize to 60 FPS
            pipe.top.x = pipe.x;
            pipe.bottom.x = pipe.x;
            pipe.gap.x = pipe.x;
            
            // Check if pipe is off screen
            if (pipe.x + this.config.width < 0) {
                pipe.isActive = false;
            }
        }
    }
    
    /**
     * Get all active pipes
     */
    getPipes() {
        return this.pipes.filter(pipe => pipe.isActive);
    }
    
    /**
     * Get pipes that haven't been scored yet
     */
    getUnscoredPipes() {
        return this.pipes.filter(pipe => pipe.isActive && !pipe.isScored);
    }
    
    /**
     * Mark a pipe as scored
     */
    markAsScored(pipeId) {
        const pipe = this.pipes.find(p => p.id === pipeId);
        if (pipe) {
            pipe.isScored = true;
        }
    }
    
    /**
     * Check if a pipe has been scored
     */
    isPipeScored(pipeId) {
        const pipe = this.pipes.find(p => p.id === pipeId);
        return pipe ? pipe.isScored : false;
    }
    
    /**
     * Reset pipe manager
     */
    reset() {
        this.pipes = [];
        this.nextPipeId = 0;
        this.lastSpawnTime = 0;
        this.spawnTimer = 0;
        this.activePipeCount = 0;
    }
    
    /**
     * Draw all pipes to canvas
     */
    draw(ctx) {
        if (!ctx) return;
        
        this.pipes.forEach(pipe => {
            if (!pipe.isActive) return;
            
            // Draw top pipe
            ctx.fillStyle = this.config.color;
            ctx.fillRect(pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
            
            // Draw pipe cap (wider top)
            ctx.fillRect(
                pipe.top.x - (this.config.capWidth - this.config.width) / 2,
                pipe.top.y + pipe.top.height - this.config.capHeight,
                this.config.capWidth,
                this.config.capHeight
            );
            
            // Draw bottom pipe
            ctx.fillRect(pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
            
            // Draw pipe cap (wider top of bottom pipe)
            ctx.fillRect(
                pipe.bottom.x - (this.config.capWidth - this.config.width) / 2,
                pipe.bottom.y,
                this.config.capWidth,
                this.config.capHeight
            );
            
            // Draw gap outline (for debugging)
            if (this.config.debug && this.config.debug.showGap) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.strokeRect(pipe.gap.x, pipe.gap.y, pipe.gap.width, pipe.gap.height);
            }
        });
    }
    
    /**
     * Get statistics about pipe generation
     */
    getStats() {
        return {
            totalPipes: this.pipes.length,
            activePipes: this.activePipeCount,
            spawnedPipes: this.nextPipeId,
            spawnInterval: this.config.spawnInterval,
            pipeSpeed: this.config.speed
        };
    }
}

// Pipe class for individual pipe management
class Pipe {
    constructor(id, x, topHeight, bottomHeight, gapY, config) {
        this.id = id;
        this.config = config;
        
        this.x = x;
        this.isActive = true;
        this.isScored = false;
        
        // Top pipe
        this.top = {
            x: x,
            y: 0,
            width: config.width,
            height: topHeight
        };
        
        // Bottom pipe
        this.bottom = {
            x: x,
            y: gapY + config.gapHeight,
            width: config.width,
            height: bottomHeight
        };
        
        // Gap between pipes
        this.gap = {
            x: x,
            y: gapY,
            width: config.width,
            height: config.gapHeight
        };
    }
    
    update(deltaTime) {
        this.x -= this.config.speed * deltaTime * 60;
        this.top.x = this.x;
        this.bottom.x = this.x;
        this.gap.x = this.x;
    }
    
    isOffScreen(canvasWidth) {
        return this.x + this.config.width < 0;
    }
    
    draw(ctx) {
        if (!ctx || !this.isActive) return;
        
        // Draw top pipe
        ctx.fillStyle = this.config.color;
        ctx.fillRect(this.top.x, this.top.y, this.top.width, this.top.height);
        
        // Draw pipe cap
        ctx.fillRect(
            this.top.x - (this.config.capWidth - this.config.width) / 2,
            this.top.y + this.top.height - this.config.capHeight,
            this.config.capWidth,
            this.config.capHeight
        );
        
        // Draw bottom pipe
        ctx.fillRect(this.bottom.x, this.bottom.y, this.bottom.width, this.bottom.height);
        
        // Draw pipe cap
        ctx.fillRect(
            this.bottom.x - (this.config.capWidth - this.config.width) / 2,
            this.bottom.y,
            this.config.capWidth,
            this.config.capHeight
        );
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PipeManager, Pipe };
}