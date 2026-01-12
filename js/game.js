import { GAME_WIDTH, GAME_HEIGHT, ENEMY_TYPES, CHARACTERS, ALL_SKILL_TYPES, WEAPON_UPGRADES, SKILL_UPGRADES } from './config.js';
import { AudioManager } from './audio.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { ExpOrb, DamageNumber } from './entities/Orbs.js';
import { t, updateTexts, setCurrentLang } from './localization.js';
import { toggleSettings, toggleDamageNumbers, updateUI, updateInventory, showLevelUpMenu } from './ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const audioManager = new AudioManager();
let gameTime = 0;
let lastTime = 0;
let nextSpawnTime = 0;
let isPaused = false;
let gameOver = false;
let loopRunning = false;
let selectedCharacter = 'knight';

const keys = { w: false, s: false, a: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

const gameState = {
    player: null,
    enemies: [],
    expOrbs: [],
    projectiles: [],
    damageNumbers: [],
    showDamageNumbers: true,
    isPaused: false
};

// --- Initialization ---

window.addEventListener('keydown', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
window.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

window.goToCharacterSelect = () => {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('character-select-screen').classList.remove('hidden');
    audioManager.init();
};

window.selectCharacter = (char) => {
    selectedCharacter = char;
    document.getElementById('character-select-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    audioManager.startBGM();
};

window.startGame = (weaponType) => {
    document.getElementById('start-screen').classList.add('hidden');
    initGame(weaponType);
};

window.toggleSettings = () => toggleSettings(gameState);
window.toggleDamageNumbers = () => toggleDamageNumbers(gameState);
window.changeLang = (lang) => { setCurrentLang(lang); updateTexts(gameTime, gameState); };
window.changeBGMVolume = (val) => {
    audioManager.bgmVolume = val / 100;
    if (audioManager.bgmGain) audioManager.bgmGain.gain.setTargetAtTime(audioManager.bgmVolume * 0.1, audioManager.ctx.currentTime, 0.05);
    document.getElementById('bgm-value').innerText = val + '%';
};
window.changeSFXVolume = (val) => {
    audioManager.sfxVolume = val / 100;
    document.getElementById('sfx-value').innerText = val + '%';
};

window.rerollChoices = () => {
    if (gameState.player && gameState.player.rerolls > 0) {
        gameState.player.rerolls--;
        audioManager.playSFX('click');
        showLevelUpMenu(gameState, audioManager, onChoiceMade);
    }
};

function initGame(weaponType) {
    gameState.player = new Player(weaponType, selectedCharacter);
    gameState.player.gainExp = function (amount) {
        this.exp += amount * this.expMult;
        audioManager.playSFX('pickup');
        if (this.exp >= this.nextLevelExp) {
            this.level++;
            this.exp -= this.nextLevelExp;
            this.nextLevelExp = Math.floor(this.nextLevelExp * 1.2);
            showLevelUpMenu(gameState, audioManager, onChoiceMade);
        }
    };

    gameState.enemies = [];
    gameState.expOrbs = [];
    gameState.damageNumbers = [];
    gameTime = 0;
    nextSpawnTime = 1;
    lastTime = performance.now();
    gameOver = false;
    isPaused = false;
    gameState.isPaused = false;

    document.getElementById('game-over-modal').classList.add('hidden');
    document.getElementById('level-up-modal').classList.add('hidden');
    updateInventory(gameState.player);
    updateUI(gameTime, gameState.player);

    if (!loopRunning) {
        loopRunning = true;
        requestAnimationFrame(loop);
    }
}

function onChoiceMade() {
    document.getElementById('level-up-modal').classList.add('hidden');
    gameState.isPaused = false;
    isPaused = false;
    lastTime = performance.now();
}

function spawnEnemy() {
    const minute = Math.min(9, Math.floor(gameTime / 30));
    const type = ENEMY_TYPES[minute];
    gameState.enemies.push(new Enemy(type));
}

function checkCollisions() {
    const player = gameState.player;
    if (!player) return;

    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < player.radius + enemy.radius) {
            player.takeDamage(enemy.damage, audioManager, endGame);
        }

        player.weapons.forEach(weapon => {
            const hitboxes = weapon.getHitboxes();
            hitboxes.forEach(hitbox => {
                const wDist = Math.hypot(hitbox.x - enemy.x, hitbox.y - enemy.y);
                if (wDist < hitbox.radius + enemy.radius) {
                    const dmg = hitbox.damage || weapon.damage * player.damageMult;
                    enemy.hp -= dmg;
                    audioManager.playSFX('hit');
                    if (gameState.showDamageNumbers) {
                        gameState.damageNumbers.push(new DamageNumber(enemy.x, enemy.y, dmg));
                    }
                }
            });
        });

        if (enemy.hp <= 0) {
            gameState.expOrbs.push(new ExpOrb(enemy.x, enemy.y, enemy.exp));
            gameState.enemies.splice(i, 1);
        }
    }

    for (let i = gameState.expOrbs.length - 1; i >= 0; i--) {
        const orb = gameState.expOrbs[i];
        const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
        if (dist < player.magnetRadius) {
            player.gainExp(orb.value);
            gameState.expOrbs.splice(i, 1);
        }
    }
}

function endGame() {
    gameOver = true;
    audioManager.playSFX('gameover');
    document.getElementById('game-over-modal').classList.remove('hidden');
    document.getElementById('final-time').innerText = Math.floor(gameTime);
}

function loop(timestamp) {
    if (gameOver) { loopRunning = false; return; }
    if (gameState.isPaused) { lastTime = timestamp; requestAnimationFrame(loop); return; }

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    gameTime += dt;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (gameTime > nextSpawnTime) {
        if (gameTime >= 300) { endGame(); return; }
        spawnEnemy();
        nextSpawnTime = gameTime + Math.max(0.2, 2.0 - (gameTime / 60));
    }

    gameState.player.update(keys);
    gameState.player.draw(ctx);

    gameState.enemies.forEach(e => { e.update(gameState.player); e.draw(ctx); });
    gameState.expOrbs.forEach(o => o.draw(ctx));
    gameState.damageNumbers.forEach((d, i) => {
        d.update(); d.draw(ctx);
        if (d.life <= 0) gameState.damageNumbers.splice(i, 1);
    });

    checkCollisions();
    updateUI(gameTime, gameState.player);
    requestAnimationFrame(loop);
}

// Global exposure for HTML buttons
window.toggleLibrary = () => document.getElementById('library-modal').classList.toggle('hidden');

updateTexts(0, null);
