/**
 * Renderer
 * 
 * Handles all canvas drawing operations.
 * Manages responsive design and animations.
 */

class Renderer {
    constructor(canvas, ctx, config) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.config = config;
        
        // Scale factor for responsive design
        this.scale = 1.0;
        
        // Background scrolling
        this.backgroundOffset = 0;
        this.groundOffset = 0;
        
        // Asset storage
        this.assets = {
            loaded: false,
            images: {},
            sounds: {}
        };
        
        // UI state
        this.uiState = {
            scoreVisible: true,
            startScreenVisible: true,
            gameOverScreenVisible: false
        };
        
        // Initialize rendering context
        this.initContext();
    }
    
    /**
     * Initialize rendering context
     */
    initContext() {
        const ctx = this.ctx;
        
        // Set default rendering quality
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = 'low';
        
        // Set text rendering defaults
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
    }
    
    /**
     * Set scale factor for responsive design
     */
    setScale(scale) {
        this.scale = scale;
    }
    
    /**
     * Draw background (sky)
     */
    drawBackground() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Light sky blue
        gradient.addColorStop(1, '#70c5ce'); // Design sky blue
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds (simple circles)
        this.drawClouds();
    }
    
    /**
     * Draw simple clouds
     */
    drawClouds() {
        const ctx = this.ctx;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Cloud 1
        ctx.beginPath();
        ctx.arc(100 + this.backgroundOffset * 0.2, 80, 20, 0, Math.PI * 2);
        ctx.arc(120 + this.backgroundOffset * 0.2, 70, 25, 0, Math.PI * 2);
        ctx.arc(140 + this.backgroundOffset * 0.2, 80, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud 2
        ctx.beginPath();
        ctx.arc(300 + this.backgroundOffset * 0.3, 120, 25, 0, Math.PI * 2);
        ctx.arc(320 + this.backgroundOffset * 0.3, 110, 30, 0, Math.PI * 2);
        ctx.arc(340 + this.backgroundOffset * 0.3, 120, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Update background offset for parallax
        this.backgroundOffset += 0.5;
        if (this.backgroundOffset > this.canvas.width) {
            this.backgroundOffset = 0;
        }
    }
    
    /**
     * Draw ground
     */
    drawGround() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const groundHeight = this.config.game.groundHeight * this.scale;
        
        // Draw ground
        ctx.fillStyle = this.config.canvas.groundColor;
        ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
        
        // Draw ground pattern (simple lines)
        ctx.strokeStyle = '#c4b47a';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < canvas.width; i += 30) {
            const x = (i + this.groundOffset) % canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - groundHeight);
            ctx.lineTo(x, canvas.height - groundHeight + 10);
            ctx.stroke();
        }
        
        // Update ground offset
        this.groundOffset += 2;
        if (this.groundOffset > 30) {
            this.groundOffset = 0;
        }
    }
    
    /**
     * Draw bird
     */
    drawBird(bird) {
        if (!bird || !bird.isAlive) return;
        
        bird.draw(this.ctx);
    }
    
    /**
     * Draw pipes
     */
    drawPipes(pipes) {
        if (!pipes || !pipes.length) return;
        
        const ctx = this.ctx;
        const pipeConfig = this.config.pipes;
        
        pipes.forEach(pipe => {
            if (!pipe.isActive) return;
            
            // Draw top pipe
            ctx.fillStyle = pipeConfig.color;
            ctx.fillRect(
                pipe.top.x * this.scale,
                pipe.top.y * this.scale,
                pipe.top.width * this.scale,
                pipe.top.height * this.scale
            );
            
            // Draw top pipe cap
            ctx.fillRect(
                (pipe.top.x - (pipeConfig.capWidth - pipeConfig.width) / 2) * this.scale,
                (pipe.top.y + pipe.top.height - pipeConfig.capHeight) * this.scale,
                pipeConfig.capWidth * this.scale,
                pipeConfig.capHeight * this.scale
            );
            
            // Draw bottom pipe
            ctx.fillRect(
                pipe.bottom.x * this.scale,
                pipe.bottom.y * this.scale,
                pipe.bottom.width * this.scale,
                pipe.bottom.height * this.scale
            );
            
            // Draw bottom pipe cap
            ctx.fillRect(
                (pipe.bottom.x - (pipeConfig.capWidth - pipeConfig.width) / 2) * this.scale,
                pipe.bottom.y * this.scale,
                pipeConfig.capWidth * this.scale,
                pipeConfig.capHeight * this.scale
            );
        });
    }
    
    /**
     * Draw score display
     */
    drawScore(score, highScore) {
        if (!this.uiState.scoreVisible) return;
        
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Draw current score
        ctx.font = this.config.ui.scoreFont;
        ctx.fillStyle = this.config.canvas.textColor;
        ctx.textAlign = 'center';
        
        const scoreX = canvas.width / 2;
        const scoreY = 50 * this.scale;
        
        ctx.fillText(score.toString(), scoreX, scoreY);
        
        // Draw high score (smaller, in corner)
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#666';
        ctx.fillText(`HI: ${highScore}`, 20 * this.scale, 20 * this.scale);
    }
    
    /**
     * Draw start screen
     */
    drawStartScreen(highScore) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.font = this.config.ui.titleFont;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Game title
        ctx.fillText('FLAPPY BIRD', centerX, centerY - 100 * this.scale);
        
        // Instructions
        ctx.font = this.config.ui.textFont;
        ctx.fillText('Press SPACE or CLICK to start', centerX, centerY);
        
        // High score
        ctx.font = this.config.ui.instructionFont;
        ctx.fillText(`High Score: ${highScore}`, centerX, centerY + 50 * this.scale);
        
        // Controls hint
        ctx.fillText('Use SPACEBAR, CLICK, or TAP to flap', centerX, centerY + 100 * this.scale);
        
        // Draw demo bird
        this.drawDemoBird(centerX, centerY - 30 * this.scale);
    }
    
    /**
     * Draw demo bird for start screen
     */
    drawDemoBird(x, y) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Animate demo bird
        const flap = Math.sin(Date.now() / 200) * 10;
        ctx.translate(0, flap);
        
        // Draw bird body
        ctx.fillStyle = this.config.bird.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20 * this.scale, 15 * this.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw wing
        ctx.fillStyle = this.config.bird.wingColor;
        ctx.beginPath();
        ctx.ellipse(-10 * this.scale, 5 * this.scale, 15 * this.scale, 8 * this.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = this.config.bird.eyeColor;
        ctx.beginPath();
        ctx.arc(8 * this.scale, -3 * this.scale, 3 * this.scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(15 * this.scale, 0);
        ctx.lineTo(25 * this.scale, -3 * this.scale);
        ctx.lineTo(25 * this.scale, 3 * this.scale);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * Draw game over screen
     */
    drawGameOverScreen(score, highScore) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Game Over text
        ctx.font = this.config.ui.titleFont;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.fillText('GAME OVER', centerX, centerY - 80 * this.scale);
        
        // Score display
        ctx.font = this.config.ui.textFont;
        ctx.fillText(`Score: ${score}`, centerX, centerY - 20 * this.scale);
        
        // High score
        ctx.fillText(`High Score: ${highScore}`, centerX, centerY + 20 * this.scale);
        
        // Restart instructions
        ctx.font = this.config.ui.instructionFont;
        ctx.fillText('Press SPACE or CLICK to restart', centerX, centerY + 80 * this.scale);
        
        // Draw medal based on score
        this.drawMedal(centerX, centerY - 50 * this.scale, score);
    }
    
    /**
     * Draw medal based on score
     */
    drawMedal(x, y, score) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x, y);
        
        let medalColor = '#cd7f32'; // Bronze by default
        
        if (score >= 50) {
            medalColor = '#ffd700'; // Gold
        } else if (score >= 25) {
            medalColor = '#c0c0c0'; // Silver
        } else if (score >= 10) {
            medalColor = '#cd7f32'; // Bronze
        } else {
            // No medal for low scores
            ctx.restore();
            return;
        }
        
        // Draw medal
        ctx.fillStyle = medalColor;
        ctx.beginPath();
        ctx.arc(0, 0, 25 * this.scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw medal details
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${16 * this.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(score.toString(), 0, 0);
        
        // Draw medal ribbon
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.ellipse(0, 30 * this.scale, 15 * this.scale, 8 * this.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Update UI state
     */
    setUIState(state) {
        this.uiState = { ...this.uiState, ...state };
    }
    
    /**
     * Load game assets
     */
    async loadAssets() {
        // This would load images and sounds
        // For now, we'll just mark as loaded
        this.assets.loaded = true;
        return true;
    }
    
    /**
     * Check if assets are loaded
     */
    areAssetsLoaded() {
        return this.assets.loaded;
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}