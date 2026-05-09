/**
 * Bird Component
 * 
 * Handles bird physics, animation, and state.
 */

class Bird {
    constructor(config) {
        this.config = config;
        
        // Position and velocity
        this.x = config.startX;
        this.y = config.startY;
        this.velocityY = 0;
        
        // Dimensions
        this.width = config.width;
        this.height = config.height;
        
        // Physics properties
        this.gravity = config.gravity;
        this.jumpForce = config.jumpForce;
        this.maxVelocity = config.maxVelocity;
        
        // State
        this.isAlive = true;
        this.rotation = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTime = 0;
        this.isFlapping = false;
        
        // Initial bounds
        this.updateBounds();
    }
    
    /**
     * Apply jump force to the bird
     */
    jump() {
        if (!this.isAlive) return;
        
        this.velocityY = this.jumpForce;
        this.isFlapping = true;
        this.animationTime = 0;
        
        // Reset rotation for upward motion
        this.rotation = -20;
    }
    
    /**
     * Update bird physics and animation
     */
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Limit velocity
        this.velocityY = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocityY));
        
        // Update position
        this.y += this.velocityY * deltaTime;
        
        // Update rotation based on velocity
        this.updateRotation();
        
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update bounding box
        this.updateBounds();
    }
    
    /**
     * Update bird rotation based on velocity
     */
    updateRotation() {
        // Rotate based on velocity
        // Upward motion: rotate up to -20 degrees
        // Downward motion: rotate down to 90 degrees
        const targetRotation = this.velocityY > 0 
            ? Math.min(90, this.velocityY * 4) 
            : Math.max(-20, this.velocityY * 2);
        
        // Smooth rotation
        this.rotation += (targetRotation - this.rotation) * 0.1;
    }
    
    /**
     * Update bird animation
     */
    updateAnimation(deltaTime) {
        this.animationTime += deltaTime;
        
        if (this.isFlapping) {
            // Flapping animation
            if (this.animationTime < 0.1) {
                this.animationFrame = 1;
            } else if (this.animationTime < 0.2) {
                this.animationFrame = 2;
            } else {
                this.animationFrame = 0;
                this.isFlapping = false;
            }
        } else {
            // Idle animation
            const frameTime = 1 / this.config.animationSpeed;
            this.animationFrame = Math.floor((this.animationTime % frameTime) / frameTime * this.config.animationFrames);
        }
    }
    
    /**
     * Update bounding box for collision detection
     */
    updateBounds() {
        this.bounds = {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    /**
     * Get bounding box for collision detection
     */
    getBounds() {
        return this.bounds;
    }
    
    /**
     * Check if bird is alive
     */
    isAlive() {
        return this.isAlive;
    }
    
    /**
     * Kill the bird
     */
    kill() {
        this.isAlive = false;
        this.velocityY = 0;
    }
    
    /**
     * Reset bird to initial state
     */
    reset() {
        this.x = this.config.startX;
        this.y = this.config.startY;
        this.velocityY = 0;
        this.isAlive = true;
        this.rotation = 0;
        this.animationFrame = 0;
        this.animationTime = 0;
        this.isFlapping = false;
        this.updateBounds();
    }
    
    /**
     * Draw bird to canvas
     */
    draw(ctx) {
        if (!ctx) return;
        
        ctx.save();
        
        // Translate to bird center for rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Draw bird body
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw wing based on animation frame
        this.drawWing(ctx);
        
        // Draw eye
        ctx.fillStyle = this.config.eyeColor;
        ctx.beginPath();
        ctx.arc(this.width / 4, -this.height / 6, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2 + 10, -3);
        ctx.lineTo(this.width / 2 + 10, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * Draw bird wing based on animation frame
     */
    drawWing(ctx) {
        ctx.fillStyle = this.config.wingColor;
        
        switch (this.animationFrame) {
            case 0: // Up position
                ctx.beginPath();
                ctx.ellipse(-this.width / 4, this.height / 4, this.width / 3, this.height / 4, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 1: // Middle position
                ctx.beginPath();
                ctx.ellipse(-this.width / 4, 0, this.width / 3, this.height / 3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 2: // Down position
                ctx.beginPath();
                ctx.ellipse(-this.width / 4, -this.height / 4, this.width / 3, this.height / 4, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }
    
    /**
     * Get current position
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    /**
     * Get current velocity
     */
    getVelocity() {
        return { x: 0, y: this.velocityY };
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bird;
}