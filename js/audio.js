export class AudioManager {
    constructor() {
        this.ctx = null;
        this.bgmVolume = 0.5;
        this.sfxVolume = 0.7;
        this.bgmGain = null;
        this.bgmStarted = false;
    }

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = this.bgmVolume * 0.1;
            this.bgmGain.connect(this.ctx.destination);
        } catch (e) {
            console.error("Audio initialization failed", e);
        }
    }

    playSFX(type) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g);
        g.connect(this.ctx.destination);
        g.gain.setValueAtTime(this.sfxVolume * 0.3, now);

        switch (type) {
            case 'hit':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
                g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'hurt':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(20, now + 0.3);
                g.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'levelup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
                g.gain.linearRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'pickup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                g.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'click':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                g.gain.linearRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'gameover':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(50, now + 1.0);
                g.gain.linearRampToValueAtTime(0.01, now + 1.0);
                osc.start(now);
                osc.stop(now + 1.0);
                break;
        }
    }

    startBGM() {
        if (this.bgmStarted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.bgmStarted = true;

        const playNote = (freq, time, dur) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            g.gain.setValueAtTime(0, time);
            g.gain.linearRampToValueAtTime(0.1, time + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, time + dur);
            osc.connect(g);
            g.connect(this.bgmGain);
            osc.start(time);
            osc.stop(time + dur);
        };

        const melody = [261.63, 0, 329.63, 0, 392.00, 0, 329.63, 0]; // C E G E
        const scheduler = () => {
            const now = this.ctx.currentTime;
            for (let i = 0; i < 8; i++) {
                const freq = melody[i];
                if (freq > 0) playNote(freq, now + i * 0.5, 0.4);
            }
            setTimeout(scheduler, 4000);
        };
        scheduler();
    }
}
