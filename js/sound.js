/**
 * Sound Manager (Optional)
 * 
 * Handles sound effects and background music.
 * Gracefully degrades if audio is not supported.
 */

class SoundManager {
    constructor(config) {
        this.config = config;
        this.sounds = {};
        this.isMuted = false;
        this.volume = config.volume || 0.5;
        this.isSupported = this.checkAudioSupport();
        
        // Load sounds if supported
        if (this.isSupported) {
            this.loadSounds();
        } else {
            console.warn('Audio not supported, sound effects disabled');
        }
    }
    
    /**
     * Check if audio is supported
     */
    checkAudioSupport() {
        return typeof Audio !== 'undefined';
    }
    
    /**
     * Load all sound effects
     */
    loadSounds() {
        const soundFiles = {
            jump: this.config.jumpSound,
            score: this.config.scoreSound,
            collision: this.config.collisionSound,
            background: this.config.backgroundMusic
        };
        
        Object.entries(soundFiles).forEach(([key, url]) => {
            if (url) {
                this.loadSound(key, url);
            }
        });
    }
    
    /**
     * Load individual sound
     */
    loadSound(key, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.preload = 'auto';
            audio.volume = this.volume;
            
            audio.addEventListener('canplaythrough', () => {
                this.sounds[key] = audio;
                resolve(audio);
            });
            
            audio.addEventListener('error', (error) => {
                console.warn(`Failed to load sound: ${key}`, error);
                // Create a dummy audio object for graceful degradation
                this.sounds[key] = { play: () => {}, pause: () => {} };
                resolve(null);
            });
            
            audio.src = url;
        });
    }
    
    /**
     * Play jump sound
     */
    playJump() {
        this.playSound('jump');
    }
    
    /**
     * Play score sound
     */
    playScore() {
        this.playSound('score');
    }
    
    /**
     * Play collision sound
     */
    playCollision() {
        this.playSound('collision');
    }
    
    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (!this.config.backgroundMusic) return;
        
        const bgMusic = this.sounds.background;
        if (bgMusic && !this.isMuted) {
            bgMusic.loop = true;
            bgMusic.volume = this.volume * 0.3; // Lower volume for background music
            bgMusic.play().catch(error => {
                console.warn('Failed to play background music:', error);
            });
        }
    }
    
    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        const bgMusic = this.sounds.background;
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
    }
    
    /**
     * Play sound by key
     */
    playSound(key) {
        if (!this.isSupported || this.isMuted) return;
        
        const sound = this.sounds[key];
        if (sound && sound.play) {
            // Clone the audio to allow overlapping sounds
            const audioClone = sound.cloneNode ? sound.cloneNode() : sound;
            audioClone.volume = this.volume;
            
            audioClone.play().catch(error => {
                console.warn(`Failed to play sound: ${key}`, error);
            });
        }
    }
    
    /**
     * Toggle mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Update all loaded sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.volume !== undefined) {
                sound.volume = this.isMuted ? 0 : this.volume;
            }
        });
        
        return this.isMuted;
    }
    
    /**
     * Set volume level (0.0 to 1.0)
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        this.isMuted = this.volume === 0;
        
        // Update all loaded sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
        
        return this.volume;
    }
    
    /**
     * Get current volume
     */
    getVolume() {
        return this.volume;
    }
    
    /**
     * Check if muted
     */
    isMuted() {
        return this.isMuted;
    }
    
    /**
     * Check if audio is supported
     */
    isAudioSupported() {
        return this.isSupported;
    }
    
    /**
     * Get sound loading status
     */
    getLoadingStatus() {
        const status = {};
        Object.keys(this.sounds).forEach(key => {
            status[key] = {
                loaded: !!this.sounds[key],
                hasError: this.sounds[key] && !this.sounds[key].play
            };
        });
        
        return {
            supported: this.isSupported,
            muted: this.isMuted,
            volume: this.volume,
            sounds: status
        };
    }
    
    /**
     * Preload all sounds
     */
    async preloadAll() {
        if (!this.isSupported) return false;
        
        const loadPromises = Object.entries(this.sounds)
            .filter(([_, sound]) => sound && sound.load)
            .map(([key, sound]) => {
                return new Promise(resolve => {
                    sound.addEventListener('canplaythrough', () => resolve(key));
                    sound.addEventListener('error', () => resolve(key));
                });
            });
        
        await Promise.all(loadPromises);
        return true;
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        // Stop all sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.pause) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
        
        this.sounds = {};
        console.log('Sound manager destroyed');
    }
    
    /**
     * Test sound functionality
     */
    testSounds() {
        const testResults = {
            supported: this.isSupported,
            muted: this.isMuted,
            volume: this.volume,
            soundsLoaded: Object.keys(this.sounds).length,
            soundKeys: Object.keys(this.sounds),
            canPlay: this.isSupported && !this.isMuted
        };
        
        // Test play each sound (if not muted)
        if (testResults.canPlay) {
            Object.keys(this.sounds).forEach(key => {
                console.log(`Testing sound: ${key}`);
                this.playSound(key);
            });
        }
        
        return testResults;
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}