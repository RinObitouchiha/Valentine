// ===================================
// CUSTOM AUDIO PLAYER
// ===================================

class CustomAudioPlayer {
    constructor(audioId) {
        this.audio = document.getElementById(audioId);
        this.playBtn = document.querySelector(`[data-audio="${audioId}"]`);
        this.progressBar = document.querySelector(`.progress-bar[data-audio="${audioId}"]`);
        this.progressContainer = this.progressBar?.parentElement;
        this.currentTimeElement = this.playBtn?.closest('.custom-audio-player')?.querySelector('.current-time');
        this.totalTimeElement = this.playBtn?.closest('.custom-audio-player')?.querySelector('.total-time');
        
        this.init();
    }
    
    init() {
        if (!this.audio || !this.playBtn) return;
        
        // Play/Pause button
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Update progress bar
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Click on progress bar to seek
        this.progressContainer?.addEventListener('click', (e) => this.seek(e));
        
        // Update duration when loaded
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Reset button when audio ends
        this.audio.addEventListener('ended', () => this.resetPlayer());
    }
    
    togglePlay() {
        if (this.audio.paused) {
            // Pause all other audio players
            document.querySelectorAll('audio').forEach(audio => {
                if (audio !== this.audio) {
                    audio.pause();
                    const btn = document.querySelector(`[data-audio="${audio.id}"]`);
                    btn?.classList.remove('playing');
                }
            });
            
            this.audio.play().catch(e => console.error("Audio play failed:", e));
            this.playBtn.classList.add('playing');
        } else {
            this.audio.pause();
            this.playBtn.classList.remove('playing');
        }
    }
    
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = percent + '%';
        }
        
        if (this.currentTimeElement) {
            this.currentTimeElement.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    seek(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }
    
    updateDuration() {
        if (this.totalTimeElement) {
            this.totalTimeElement.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    resetPlayer() {
        this.playBtn.classList.remove('playing');
        this.progressBar.style.width = '0%';
        this.currentTimeElement.textContent = '0:00';
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Initialize all audio players when page loads
window.addEventListener('load', () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        new CustomAudioPlayer(audio.id);
    });
});

// ===================================
// VOLUME CONTROL (Optional Enhancement)
// ===================================
document.querySelectorAll('audio').forEach(audio => {
    audio.volume = 0.8; // Set default volume to 80%
});
