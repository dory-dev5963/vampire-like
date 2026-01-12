// --- CONSTANTS & CONFIG ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const ENEMY_TYPES = [
    { color: '#e74c3c', speed: 1.0, hp: 10, radius: 12, damage: 5, exp: 5 },    // 0-30s
    { color: '#00d2d3', speed: 2.0, hp: 8, radius: 10, damage: 8, exp: 10 },    // 30-60s
    { color: '#10ac84', speed: 0.6, hp: 50, radius: 20, damage: 15, exp: 25 },  // 60-90s
    { color: '#5f27cd', speed: 1.3, hp: 120, radius: 15, damage: 20, exp: 100 },// 90-120s
    { color: '#e67e22', speed: 1.5, hp: 80, radius: 12, damage: 15, exp: 80 },  // 120-150s Swarm
    { color: '#2980b9', speed: 1.8, hp: 200, radius: 18, damage: 25, exp: 200 },// 150-180s
    { color: '#2c3e50', speed: 0.8, hp: 500, radius: 25, damage: 40, exp: 500 },// 180-210s
    { color: '#ecf0f1', speed: 2.5, hp: 150, radius: 15, damage: 30, exp: 300 },// 210-240s
    { color: '#8e44ad', speed: 1.0, hp: 1000, radius: 40, damage: 50, exp: 1000 },// 240-270s
    { color: '#c0392b', speed: 1.5, hp: 2000, radius: 20, damage: 60, exp: 2000 } // 270-300s
];

const CHARACTERS = {
    knight: { hp: 150, armor: 2, magnetRadius: 25, attackDamage: 1.0, attackFrequency: 1.0, moveSpeed: 2.5, attackSpeed: 1.0, projSpeed: 1.0, rerolls: 2, color: '#3498db' },
    rogue: { hp: 70, armor: 0, magnetRadius: 50, attackDamage: 1.0, attackFrequency: 1.1, moveSpeed: 4.0, attackSpeed: 1.2, projSpeed: 1.2, rerolls: 4, color: '#2ecc71' },
    mage: { hp: 80, armor: 0, magnetRadius: 35, attackDamage: 1.2, attackFrequency: 1.3, moveSpeed: 3.0, attackSpeed: 1.0, projSpeed: 0.8, rerolls: 2, color: '#9b59b6' }
};

const RARITIES = {
    common: { id: 'common', mult: 1.0, prob: 0.70, color: '#ffffff' },
    uncommon: { id: 'uncommon', mult: 1.5, prob: 0.20, color: '#2ecc71' },
    great: { id: 'great', mult: 2.5, prob: 0.08, color: '#3498db' },
    legend: { id: 'legend', mult: 4.0, prob: 0.02, color: '#f1c40f' }
};

const WEAPON_RARITIES = {
    common: { id: 'common', mult: 1.0, prob: 0.40, color: '#ffffff' },
    uncommon: { id: 'uncommon', mult: 1.5, prob: 0.30, color: '#2ecc71' },
    great: { id: 'great', mult: 2.5, prob: 0.20, color: '#3498db' },
    legend: { id: 'legend', mult: 4.0, prob: 0.10, color: '#f1c40f' }
};

const TRANSLATIONS = {
    en: {
        orbit_weapon: "Orbit", orbit_desc: "Rotating defensive orbs", wand_weapon: "Magic Wand", wand_desc: "Shoots nearest enemy", aura_weapon: "Aura", aura_desc: "Damages area around you",
        settings: "Settings", language: "Language / 言語", library: "Library", weapons: "Weapons", skills: "Skills", close: "Close", time: "Time: ", level: "Level: ", hp: "HP", exp: "EXP",
        game_over: "GAME OVER", game_clear: "GAME CLEAR!", survived: "Survived: ", cleared: "5 Minutes Achieved!", retry: "Retry", level_up: "Level Up!", heal: "Heal 50 Max HP",
        up_dmg: "Weapon Damage Up", up_hp: "Max HP +20", add_orb: "Add Orb (+1)", up_orb_spd: "Orb Speed Up", add_proj: "Add Projectile (+1)", up_fire: "Fire Rate Up",
        up_aura_size: "Aura Size Up", up_aura_dmg: "Aura Dmg Frequency Up", up_magnet: "Magnet Radius Up", knife_weapon: "Knife", knife_desc: "Fast throwing knives",
        holy_water_weapon: "Holy Water", holy_water_desc: "Burns area on ground", lightning_weapon: "Lightning", lightning_desc: "Chain lightning attack",
        add_knife: "Knife +1", add_lightning_chain: "Chain Target +1", desc_damage_up: "Damage +20%", desc_speed_up: "Attack Speed +20%", desc_area_up: "Attack Area +20%",
        desc_size_up: "Size +25%", desc_count_up: "Amount +1", desc_chain_up: "Chain +1", desc_duration_up: "Duration +30%", upgrade: "UPGRADE",
        skill_muscle: "Spinach", skill_heart: "Hollow Heart", skill_tome: "Empty Tome", skill_scope: "Candelabrador", skill_duplicator: "Duplicator", skill_magnet: "Attractorb",
        skill_muscle_desc: "Increases damage by 10%.", skill_heart_desc: "Increases max HP by 20%.", skill_tome_desc: "Reduces cooldown by 10%.", skill_scope_desc: "Increases area by 10%.",
        skill_duplicator_desc: "Increases amount of shots.", skill_magnet_desc: "Increases magnet radius by 25%.", desc_dmg_10: "Damage +10%", desc_hp_20: "Max HP +20%",
        desc_area_10: "Area +10%", desc_amount_1: "Amount +1", desc_amount_0: "Effect Continue", desc_magnet_25: "Magnet +25%", skill_wings: "Wings", skill_crown: "Crown",
        skill_armor: "Armor", skill_pummarola: "Pummarola", skill_bracer: "Bracer", skill_spellbinder: "Spellbinder", skill_wings_desc: "Increases move speed by 10%.",
        skill_crown_desc: "Increases exp gain by 10%.", skill_armor_desc: "Reduces damage taken by 1.", skill_pummarola_desc: "Regenerates 0.2 HP per second.",
        skill_bracer_desc: "Increases projectile speed by 10%.", skill_spellbinder_desc: "Increases weapon duration by 10%.", desc_move_speed_10: "Move Speed +10%",
        desc_exp_10: "Exp Gain +10%", desc_armor_1: "Armor +1", desc_regen_02: "Regen +0.2/sec", desc_proj_speed_10: "Proj Speed +10%", desc_duration_10: "Duration +10%",
        settings_show_dmg: "Show Damage: ON", settings_hide_dmg: "Show Damage: OFF", affects: "Affects: ", scope_all: "All Weapons", scope_player: "Player", scope_proj: "Projectiles",
        scope_duration: "Duration Weapons", scope_muscle: "scope_all", scope_heart: "scope_player", scope_tome: "scope_all", scope_scope: "scope_all", scope_duplicator: "scope_all",
        scope_magnet: "scope_player", scope_wings: "scope_player", scope_crown: "scope_player", scope_armor: "scope_player", scope_pummarola: "scope_player",
        scope_bracer: "scope_proj", scope_spellbinder: "scope_duration", upgrade_count: "Count", upgrade_damage: "Damage", upgrade_area: "Area", upgrade_damage_flat: "Dmg",
        upgrade_speed: "Speed", upgrade_amount: "Amount", upgrade_duration: "Duration", skill_muscle_up: "Damage", skill_heart_up: "HP", skill_tome_up: "Speed",
        skill_scope_up: "Area", skill_duplicator_up: "Amount", skill_magnet_up: "Magnet", skill_wings_up: "Speed", skill_crown_up: "Exp", skill_armor_up: "Armor",
        skill_pummarola_up: "Regen", skill_bracer_up: "Speed", skill_spellbinder_up: "Duration", label_weapon: "WEAPON", label_skill: "PASSIVE",
        select_character: "Select Your Character", char_knight: "Knight", char_rogue: "Rogue", char_mage: "Mage", char_knight_desc: "High HP & Armor", char_rogue_desc: "High Speed & Magnet",
        char_mage_desc: "High Damage & Cooldown", stat_hp_label: "HP", stat_atk_dmg_label: "Atk Damage", stat_atk_freq_label: "Atk Frequency", stat_move_speed_label: "Move Speed",
        stat_atk_speed_label: "Atk Speed", stat_armor_label: "Armor", stat_magnet_label: "Magnet", rarity_common: "COMMON", rarity_uncommon: "UNCOMMON", rarity_great: "GREAT",
        rarity_legend: "LEGEND", bgm_volume: "BGM Volume", sfx_volume: "SFX Volume", reroll: "Reroll", reroll_remaining: "Remaining: ", start_game: "START GAME",
        game_title: "BLOOD SURVIVOR", select_weapon: "Select Weapon", choose_start_weapon: "Choose your starting weapon:"
    },
    ja: {
        orbit_weapon: "オービット", orbit_desc: "周囲を回転する防御オーブ", wand_weapon: "マジックワンド", wand_desc: "近くの敵を攻撃", aura_weapon: "オーラ", aura_desc: "周囲のエリアにダメージ",
        settings: "設定", language: "言語 / Language", library: "ライブラリ", weapons: "武器", skills: "スキル", close: "閉じる", time: "時間: ", level: "レベル: ", hp: "体力", exp: "経験値",
        game_over: "ゲームオーバー", game_clear: "ゲームクリア！", survived: "生存時間: ", cleared: "5分間生存達成！", retry: "リトライ", level_up: "レベルアップ!", heal: "最大HPの50回復",
        up_dmg: "武器ダメージ強化", up_hp: "最大HP増加 (+20)", add_orb: "オーブ追加 (+1)", up_orb_spd: "オーブ速度上昇", add_proj: "弾数追加 (+1)", up_fire: "発射速度上昇",
        up_aura_size: "オーラ範囲拡大", up_aura_dmg: "オーラダメージ頻度上昇", up_magnet: "経験値回収範囲拡大", knife_weapon: "ナイフ", knife_desc: "高速投げナイフ",
        holy_water_weapon: "聖水", holy_water_desc: "地面にダメージエリアを生成", lightning_weapon: "ライトニング", lightning_desc: "連鎖雷撃",
        add_knife: "ナイフ+1", add_lightning_chain: "連鎖対象+1", desc_damage_up: "ダメージ +20%", desc_speed_up: "攻撃速度 +20%", desc_area_up: "攻撃範囲 +20%",
        desc_size_up: "サイズ +25%", desc_count_up: "発射数 +1", desc_chain_up: "連鎖数 +1", desc_duration_up: "持続時間 +30%", upgrade: "強化",
        skill_muscle: "ほうれん草", skill_heart: "愛の心", skill_tome: "空白の書", skill_scope: "ロウソク", skill_duplicator: "複写の輪", skill_magnet: "磁石",
        skill_muscle_desc: "ダメージを10%上昇させる。", skill_heart_desc: "最大HPを20%上昇させる。", skill_tome_desc: "クールダウンを10%短縮する。", skill_scope_desc: "攻撃範囲を10%拡大する。",
        skill_duplicator_desc: "発射数を増加させる。", skill_magnet_desc: "回収範囲を25%拡大する。", desc_dmg_10: "ダメージ +10%", desc_hp_20: "最大HP +20%",
        desc_area_10: "範囲 +10%", desc_amount_1: "発射数 +1", desc_amount_0: "効果継続", desc_magnet_25: "回収範囲 +25%", skill_wings: "翼", skill_crown: "王冠",
        skill_armor: "鎧", skill_pummarola: "プンマローラ", skill_bracer: "手甲", skill_spellbinder: "呪文の縛り", skill_wings_desc: "移動速度が10%上昇する。",
        skill_crown_desc: "獲得経験値が10%増加する。", skill_armor_desc: "受けるダメージを1減少させる。", skill_pummarola_desc: "毎秒0.2HP回復する。",
        skill_bracer_desc: "発射物の速度が10%上昇する。", skill_spellbinder_desc: "武器の効果時間が10%延長される。", desc_move_speed_10: "移動速度 +10%",
        desc_exp_10: "経験値 +10%", desc_armor_1: "防御力 +1", desc_regen_02: "回復 +0.2/秒", desc_proj_speed_10: "弾速 +10%", desc_duration_10: "効果時間 +10%",
        settings_show_dmg: "ダメージ表示: ON", settings_hide_dmg: "ダメージ表示: OFF", affects: "対象: ", scope_all: "全武器", scope_player: "プレイヤー", scope_proj: "発射物",
        scope_duration: "持続系武器", scope_muscle: "scope_all", scope_heart: "scope_player", scope_tome: "scope_all", scope_scope: "scope_all", scope_duplicator: "scope_all",
        scope_magnet: "scope_player", scope_wings: "scope_player", scope_crown: "scope_player", scope_armor: "scope_player", scope_pummarola: "scope_player",
        scope_bracer: "scope_proj", scope_spellbinder: "scope_duration", upgrade_count: "個数", upgrade_damage: "ダメージ", upgrade_area: "範囲", upgrade_damage_flat: "ダメージ",
        upgrade_speed: "速度", upgrade_amount: "発射数", upgrade_duration: "時間", skill_muscle_up: "威力", skill_heart_up: "HP", skill_tome_up: "速度",
        skill_scope_up: "範囲", skill_duplicator_up: "個数", skill_magnet_up: "磁石", skill_wings_up: "速度", skill_crown_up: "経験値", skill_armor_up: "防御",
        skill_pummarola_up: "回復", skill_bracer_up: "速度", skill_spellbinder_up: "時間", label_weapon: "武器", label_skill: "パッシブ",
        select_character: "キャラクターを選択", char_knight: "騎士", char_rogue: "盗賊", char_mage: "魔法使い", char_knight_desc: "高いHPと防御力を持つ", char_rogue_desc: "移動速度と回収範囲に優れる",
        char_mage_desc: "高い攻撃力と攻撃頻度を誇る", stat_hp_label: "HP", stat_atk_dmg_label: "攻撃力", stat_atk_freq_label: "攻撃頻度", stat_move_speed_label: "移動速度",
        stat_atk_speed_label: "攻撃速度", stat_armor_label: "防御", stat_magnet_label: "回収", rarity_common: "コモン", rarity_uncommon: "アンコモン", rarity_great: "グレート",
        rarity_legend: "レジェンド", bgm_volume: "BGM音量", sfx_volume: "SE音量", reroll: "リロール", reroll_remaining: "残り: ", start_game: "ゲーム開始",
        game_title: "ブラッド・サバイバー", select_weapon: "武器の選択", choose_start_weapon: "最初の武器を選択してください:"
    }
};

let currentLang = 'ja';
function t(key) { return TRANSLATIONS[currentLang][key] || key; }
function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerText = t(el.getAttribute('data-i18n')); });
}

// --- AUDIO MANAGER ---
class AudioManager {
    constructor() { this.ctx = null; this.bgmVolume = 0.5; this.sfxVolume = 0.7; this.bgmGain = null; this.bgmStarted = false; }
    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.bgmGain = this.ctx.createGain(); this.bgmGain.gain.value = this.bgmVolume * 0.1; this.bgmGain.connect(this.ctx.destination);
        } catch (e) { console.error("Audio init failed", e); }
    }
    playSFX(type) {
        if (!this.ctx) this.init(); if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime; const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
        osc.connect(g); g.connect(this.ctx.destination); g.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        switch (type) {
            case 'hit': osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.1); g.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); break;
            case 'hurt': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(20, now + 0.3); g.gain.linearRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); break;
            case 'levelup': osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.exponentialRampToValueAtTime(880, now + 0.5); g.gain.linearRampToValueAtTime(0.01, now + 0.5); osc.start(now); osc.stop(now + 0.5); break;
            case 'pickup': osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1); g.gain.linearRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); break;
            case 'click': osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); g.gain.linearRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05); break;
            case 'gameover': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.linearRampToValueAtTime(50, now + 1.0); g.gain.linearRampToValueAtTime(0.01, now + 1.0); osc.start(now); osc.stop(now + 1.0); break;
        }
    }
    startBGM() {
        if (this.bgmStarted) return; this.init(); if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume(); this.bgmStarted = true;
        const playNote = (freq, time, dur) => {
            const osc = this.ctx.createOscillator(); const g = this.ctx.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, time);
            g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(0.1, time + 0.05); g.gain.exponentialRampToValueAtTime(0.001, time + dur);
            osc.connect(g); g.connect(this.bgmGain); osc.start(time); osc.stop(time + dur);
        };
        const melody = [261.63, 0, 329.63, 0, 392.00, 0, 329.63, 0];
        const scheduler = () => {
            const now = this.ctx.currentTime; for (let i = 0; i < 8; i++) { const freq = melody[i]; if (freq > 0) playNote(freq, now + i * 0.5, 0.4); }
            setTimeout(scheduler, 4000);
        };
        scheduler();
    }
}
const audioManager = new AudioManager();

// --- ENTITIES ---
class Enemy {
    constructor(type) {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = Math.random() * GAME_WIDTH; this.y = -20; }
        else if (side === 1) { this.x = GAME_WIDTH + 20; this.y = Math.random() * GAME_HEIGHT; }
        else if (side === 2) { this.x = Math.random() * GAME_WIDTH; this.y = GAME_HEIGHT + 20; }
        else { this.x = -20; this.y = Math.random() * GAME_HEIGHT; }
        this.radius = type.radius; this.speed = type.speed + Math.random() * 0.3; this.hp = type.hp; this.damage = type.damage; this.color = type.color; this.exp = type.exp || 5;
    }
    update(target) {
        const dx = target.x - this.x; const dy = target.y - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) { this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed; }
    }
    draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
}

class ExpOrb {
    constructor(x, y, value) {
        this.x = x; this.y = y; this.value = value; this.radius = 4;
        if (value >= 100) { this.color = '#9b59b6'; this.radius = 8; }
        else if (value >= 25) { this.color = '#f1c40f'; this.radius = 6; }
        else if (value >= 10) { this.color = '#3498db'; this.radius = 5; }
        else { this.color = '#2ecc71'; }
    }
    draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke(); }
}

class DamageNumber {
    constructor(x, y, value) { this.x = x; this.y = y; this.value = Math.floor(value); this.life = 60; this.vy = -1; this.alpha = 1.0; const gb = Math.floor(Math.max(50, 255 - (this.value * 3))); this.colorStr = `${gb}, ${gb}`; }
    update() { this.y += this.vy; this.life--; this.alpha = Math.max(0, this.life / 30); }
    draw(ctx) { ctx.fillStyle = `rgba(255, ${this.colorStr}, ${this.alpha})`; ctx.font = 'bold 20px sans-serif'; ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha})`; ctx.lineWidth = 3; ctx.textAlign = 'center'; ctx.strokeText(this.value, this.x, this.y); ctx.fillText(this.value, this.x, this.y); }
}

// --- WEAPON UPGRADES ---
const WEAPON_UPGRADES = {
    orbit: [
        { level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_count' }] },
        { level: 3, upgrades: [{ type: 'passive_damage', val: 0.5, descKey: 'upgrade_damage' }] },
        { level: 4, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_count' }] },
        { level: 5, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] },
        { level: 6, upgrades: [{ type: 'count', val: 2, descKey: 'upgrade_count' }] },
    ],
    wand: [
        { level: 2, upgrades: [{ type: 'passive_damage', val: 5, descKey: 'upgrade_damage_flat' }] },
        { level: 3, upgrades: [{ type: 'passive_speed', val: 0.2, descKey: 'upgrade_speed' }] },
        { level: 4, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 5, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] },
        { level: 6, upgrades: [{ type: 'count', val: 2, descKey: 'upgrade_amount' }] },
    ],
    aura: [
        { level: 2, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] },
        { level: 3, upgrades: [{ type: 'passive_damage', val: 2, descKey: 'upgrade_damage_flat' }] },
        { level: 4, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] },
        { level: 5, upgrades: [{ type: 'passive_damage', val: 3, descKey: 'upgrade_damage_flat' }] },
        { level: 6, upgrades: [{ type: 'passive_area', val: 0.4, descKey: 'upgrade_area' }] },
    ],
    knife: [
        { level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 3, upgrades: [{ type: 'passive_damage', val: 3, descKey: 'upgrade_damage_flat' }] },
        { level: 4, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 5, upgrades: [{ type: 'passive_speed', val: 0.3, descKey: 'upgrade_speed' }] },
        { level: 6, upgrades: [{ type: 'count', val: 3, descKey: 'upgrade_amount' }] },
    ],
    holy_water: [
        { level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 3, upgrades: [{ type: 'passive_area', val: 0.3, descKey: 'upgrade_area' }] },
        { level: 4, upgrades: [{ type: 'passive_duration', val: 0.5, descKey: 'upgrade_duration' }] },
        { level: 5, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 6, upgrades: [{ type: 'passive_damage', val: 5, descKey: 'upgrade_damage_flat' }] },
    ],
    lightning: [
        { level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 3, upgrades: [{ type: 'passive_damage', val: 15, descKey: 'upgrade_damage_flat' }] },
        { level: 4, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] },
        { level: 5, upgrades: [{ type: 'passive_area', val: 0.3, descKey: 'upgrade_area' }] },
        { level: 6, upgrades: [{ type: 'count', val: 3, descKey: 'upgrade_amount' }] },
    ]
};

const SKILL_UPGRADES = {
    muscle: [{ level: 2, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 3, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 4, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 5, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 6, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }],
    heart: [{ level: 2, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 3, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 4, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 5, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 6, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }],
    tome: [{ level: 2, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 3, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 4, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 5, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 6, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }],
    scope: [{ level: 2, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 3, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 4, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 5, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 6, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }],
    duplicator: [{ level: 2, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 3, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 4, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 5, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 6, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }],
    magnet: [{ level: 2, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 3, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 4, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 5, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 6, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }],
    wings: [{ level: 2, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 3, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 4, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 5, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 6, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }],
    crown: [{ level: 2, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 3, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 4, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 5, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 6, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }],
    armor: [{ level: 2, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 3, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 4, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 5, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 6, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }],
    pummarola: [{ level: 2, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 3, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 4, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 5, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 6, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }],
    bracer: [{ level: 2, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 3, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 4, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 5, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 6, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }],
    spellbinder: [{ level: 2, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 3, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 4, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 5, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 6, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }]
};

const ALL_WEAPON_TYPES = ['orbit', 'wand', 'aura', 'knife', 'holy_water', 'lightning'];
const ALL_SKILL_TYPES = ['muscle', 'heart', 'tome', 'scope', 'duplicator', 'magnet', 'wings', 'crown', 'armor', 'pummarola', 'bracer', 'spellbinder'];

function applyUpgrade(weapon, upgradeInfo) {
    switch (upgradeInfo.type) {
        case 'passive_damage': weapon.damage *= (1 + upgradeInfo.val); break;
        case 'passive_speed': weapon.cooldown *= (1 - upgradeInfo.val); break;
        case 'passive_area': weapon.radius *= (1 + upgradeInfo.val); break;
        case 'passive_proj_speed': if (weapon.projectileSpeed) weapon.projectileSpeed *= (1 + upgradeInfo.val); if (weapon.throwSpeed) weapon.throwSpeed *= (1 + upgradeInfo.val); break;
        case 'passive_duration': if (weapon.duration) weapon.duration *= (1 + upgradeInfo.val); break;
        case 'damage': weapon.damage += upgradeInfo.val; break;
        case 'speed': weapon.cooldown *= (1 - upgradeInfo.val); break;
        case 'area': weapon.radius *= (1 + upgradeInfo.val); break;
        case 'size': if (weapon.projectileSize) weapon.projectileSize *= (1 + upgradeInfo.val); if (weapon.projectileRadius) weapon.projectileRadius *= (1 + upgradeInfo.val); if (weapon.radius) weapon.radius *= (1 + upgradeInfo.val); break;
        case 'count': if (weapon.projectileCount !== undefined) weapon.projectileCount += upgradeInfo.val; if (weapon.chainCount !== undefined) weapon.chainCount += upgradeInfo.val; if (weapon.count !== undefined) weapon.count += upgradeInfo.val; break;
        case 'duration': if (weapon.duration !== undefined) weapon.duration *= (1 + upgradeInfo.val); break;
    }
}

class OrbitWeapon {
    constructor(owner) { this.owner = owner; this.radius = 60; this.projectileRadius = 10; this.angle = 0; this.projectileCount = 2; this.rotationSpeed = 0.05; this.damage = 15; this.type = 'orbit'; this.level = 1; this.maxLevel = 6; }
    update() { const speedMult = this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult; this.angle += this.rotationSpeed * speedMult; }
    draw(ctx) { ctx.fillStyle = '#f1c40f'; const total = this.projectileCount + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const currentAngle = this.angle + (i * Math.PI * 2) / total; const x = this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult); const y = this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult); ctx.beginPath(); ctx.arc(x, y, this.projectileRadius, 0, Math.PI * 2); ctx.fill(); } }
    getHitboxes() { const boxes = []; const total = this.projectileCount + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const currentAngle = this.angle + (i * Math.PI * 2) / total; boxes.push({ x: this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult), y: this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult), radius: this.projectileRadius, damage: this.damage * this.owner.damageMult }); } return boxes; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class WandWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 60; this.timer = 0; this.projectileSpeed = 7; this.projectileSize = 6; this.damage = 10; this.type = 'wand'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < 0 || p.x > GAME_WIDTH || p.y < 0 || p.y > GAME_HEIGHT) this.projectiles.splice(i, 1); } }
    fire() { const total = 1 + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: this.projectileSpeed * this.owner.projectileSpeedMult, dy: 0, radius: this.projectileSize, damage: this.damage * this.owner.damageMult }); }
    draw(ctx) { ctx.fillStyle = '#3498db'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class AuraWeapon {
    constructor(owner) { this.owner = owner; this.radius = 80; this.damage = 1; this.damageInterval = 30; this.timer = 0; this.type = 'aura'; this.level = 1; this.maxLevel = 6; }
    update() { this.timer++; const effective = this.damageInterval / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.shouldDamage = true; } else this.shouldDamage = false; }
    draw(ctx) { ctx.fillStyle = 'rgba(155, 89, 182, 0.2)'; ctx.beginPath(); ctx.arc(this.owner.x, this.owner.y, this.radius * this.owner.areaMult, 0, Math.PI * 2); ctx.fill(); }
    getHitboxes() { if (!this.shouldDamage) return []; return [{ x: this.owner.x, y: this.owner.y, radius: this.radius * this.owner.areaMult, damage: Math.max(1, Math.floor(this.damage * this.owner.damageMult)) }]; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class KnifeWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 45; this.timer = 0; this.projectileSpeed = 10; this.projectileSize = 4; this.damage = 12; this.projectileCount = 1; this.type = 'knife'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < 0 || p.x > GAME_WIDTH || p.y < 0 || p.y > GAME_HEIGHT) this.projectiles.splice(i, 1); } }
    fire() { const total = this.projectileCount + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const spread = (i - (total - 1) / 2) * 0.1; this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: this.projectileSpeed * this.owner.projectileSpeedMult, dy: spread * 10, radius: this.projectileSize, damage: this.damage * this.owner.damageMult }); } }
    draw(ctx) { ctx.fillStyle = '#ecf0f1'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class HolyWaterWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 120; this.timer = 0; this.duration = 180; this.radius = 40; this.damage = 10; this.throwSpeed = 8; this.count = 1; this.type = 'holy_water'; this.level = 1; this.maxLevel = 6; this.zones = []; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; p.life--; if (p.life <= 0) { this.zones.push({ x: p.x, y: p.y, radius: this.radius * this.owner.areaMult, life: this.duration * this.owner.durationMult, maxLife: this.duration * this.owner.durationMult, damage: this.damage * this.owner.damageMult }); this.projectiles.splice(i, 1); } } for (let i = this.zones.length - 1; i >= 0; i--) { const z = this.zones[i]; z.life--; if (z.life <= 0) this.zones.splice(i, 1); } }
    fire() { const total = this.count + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const angle = Math.random() * Math.PI * 2; const dist = 100 + Math.random() * 100; const travelTime = Math.max(5, 30 / this.owner.projectileSpeedMult); this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: (dist * Math.cos(angle)) / travelTime, dy: (dist * Math.sin(angle)) / travelTime, life: travelTime }); } }
    draw(ctx) { ctx.fillStyle = '#3498db'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); }); this.zones.forEach(z => { const alpha = (z.life / z.maxLife) * 0.6; ctx.fillStyle = `rgba(231, 76, 60, ${alpha})`; ctx.beginPath(); ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.zones; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class LightningWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 90; this.timer = 0; this.damage = 30; this.chainCount = 2; this.range = 200; this.activeChain = []; this.chainTimer = 0; this.type = 'lightning'; this.level = 1; this.maxLevel = 6; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.strike(); } if (this.chainTimer > 0) this.chainTimer--; }
    strike() {
        const player = this.owner; let currentSource = player; let hit = [];
        for (let i = 0; i < this.chainCount; i++) {
            let nearest = null; let minDist = this.range;
            gameState.enemies.forEach(e => { if (!hit.includes(e)) { const d = Math.hypot(currentSource.x - e.x, currentSource.y - e.y); if (d < minDist) { minDist = d; nearest = e; } } });
            if (nearest) { hit.push(nearest); const dmg = this.damage * player.damageMult; nearest.hp -= dmg; audioManager.playSFX('hit'); if (gameState.showDamageNumbers) gameState.damageNumbers.push(new DamageNumber(nearest.x, nearest.y, dmg)); currentSource = nearest; } else break;
        }
        if (hit.length > 0) { this.activeChain = [player, ...hit]; this.chainTimer = 10; }
    }
    draw(ctx) { if (this.chainTimer > 0 && this.activeChain.length > 1) { ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(this.activeChain[0].x, this.activeChain[0].y); for (let i = 1; i < this.activeChain.length; i++) ctx.lineTo(this.activeChain[i].x, this.activeChain[i].y); ctx.stroke(); } }
    getHitboxes() { return []; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

function createWeapon(type, owner) {
    switch (type) {
        case 'orbit': return new OrbitWeapon(owner); case 'wand': return new WandWeapon(owner); case 'aura': return new AuraWeapon(owner);
        case 'knife': return new KnifeWeapon(owner); case 'holy_water': return new HolyWaterWeapon(owner); case 'lightning': return new LightningWeapon(owner);
    }
    return null;
}

class Player {
    constructor(weaponType, charKey) {
        const char = CHARACTERS[charKey] || CHARACTERS.knight;
        this.x = GAME_WIDTH / 2; this.y = GAME_HEIGHT / 2; this.radius = 10;
        this.moveSpeed = char.moveSpeed; this.hp = char.hp; this.maxHp = char.hp;
        this.level = 1; this.exp = 0; this.nextLevelExp = 10; this.magnetRadius = char.magnetRadius;
        this.weapons = [createWeapon(weaponType, this)]; this.maxWeapons = 3;
        this.color = char.color; this.charType = charKey; this.skills = []; this.maxSkills = 3;
        this.damageMult = char.attackDamage; this.areaMult = 1.0; this.cooldownMult = 1.0;
        this.projectileCountBonus = 0; this.moveSpeedMult = 1.0; this.expMult = 1.0;
        this.armor = char.armor; this.regenAmount = 0; this.regenTimer = 0;
        this.projectileSpeedMult = char.projSpeed; this.durationMult = 1.0; this.rerolls = char.rerolls;
        this.attackFrequency = char.attackFrequency; this.attackSpeed = char.attackSpeed;
    }
    update(keys) {
        let dx = 0, dy = 0;
        if (keys.w || keys.ArrowUp) dy = -1; if (keys.s || keys.ArrowDown) dy = 1;
        if (keys.a || keys.ArrowLeft) dx = -1; if (keys.d || keys.ArrowRight) dx = 1;
        if (dx !== 0 && dy !== 0) { const len = Math.sqrt(dx * dx + dy * dy); dx /= len; dy /= len; }
        this.x += dx * this.moveSpeed * this.moveSpeedMult; this.y += dy * this.moveSpeed * this.moveSpeedMult;
        this.x = Math.max(this.radius, Math.min(GAME_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(GAME_HEIGHT - this.radius, this.y));
        if (this.regenAmount > 0) { this.regenTimer++; if (this.regenTimer >= 60) { this.hp = Math.min(this.maxHp, this.hp + this.regenAmount); this.regenTimer = 0; } }
        this.weapons.forEach(w => w.update());
    }
    draw(ctx) {
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth = 2; ctx.beginPath();
        if (this.charType === 'knight') ctx.arc(this.x, this.y, this.radius - 3, 0.5, Math.PI - 0.5);
        else if (this.charType === 'rogue') { ctx.moveTo(this.x - 4, this.y - 4); ctx.lineTo(this.x + 4, this.y + 4); ctx.moveTo(this.x + 4, this.y - 4); ctx.lineTo(this.x - 4, this.y + 4); }
        else if (this.charType === 'mage') ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.stroke(); this.weapons.forEach(w => w.draw(ctx));
    }
    takeDamage(amt, am, onEnd) { const d = Math.max(1, amt - this.armor); this.hp -= d; am.playSFX('hurt'); if (this.hp <= 0) { this.hp = 0; onEnd(); } }
    hasWeapon(type) { return this.weapons.some(w => w.type === type); }
    addWeapon(type) { if (this.weapons.length < this.maxWeapons && !this.hasWeapon(type)) this.weapons.push(createWeapon(type, this)); }
    hasSkill(type) { return this.skills.some(s => s.type === type); }
    addSkill(type) { if (this.skills.length < this.maxSkills && !this.hasSkill(type)) { this.skills.push({ type, level: 1, maxLevel: 6 }); this.applySkillStat(SKILL_UPGRADES[type].find(u => u.level === 1).upgrades[0]); } }
    upgradeSkill(type, custom) {
        const s = this.skills.find(sk => sk.type === type);
        if (s && s.level < s.maxLevel) { s.level++; (custom || SKILL_UPGRADES[type].find(u => u.level === s.level).upgrades).forEach(u => this.applySkillStat(u)); }
    }
    applySkillStat(u) {
        switch (u.type) {
            case 'passive_damage': this.damageMult += u.val; break;
            case 'passive_hp': const old = this.maxHp; this.maxHp *= (1 + u.val); this.hp += (this.maxHp - old); break;
            case 'passive_speed': this.cooldownMult *= (1 - u.val); break;
            case 'passive_area': this.areaMult += u.val; break;
            case 'passive_amount': this.projectileCountBonus += u.val; break;
            case 'passive_magnet': this.magnetRadius *= (1 + u.val); break;
            case 'passive_move_speed': this.moveSpeedMult += u.val; break;
            case 'passive_exp': this.expMult += u.val; break;
            case 'passive_armor': this.armor += u.val; break;
            case 'passive_regen': this.regenAmount += u.val; break;
            case 'passive_proj_speed': this.projectileSpeedMult += u.val; break;
            case 'passive_duration': this.durationMult += u.val; break;
        }
    }
}

// --- GAME STATE & ENGINE ---
const gameState = { player: null, enemies: [], expOrbs: [], projectiles: [], damageNumbers: [], showDamageNumbers: true, isPaused: false, selectedCharacter: 'knight' };
const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');
let gameTime = 0, lastTime = 0, nextSpawnTime = 0, loopRunning = false;
const keys = { w: false, s: false, a: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

window.addEventListener('keydown', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
window.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

function updateUI() {
    if (!gameState.player) return;
    document.getElementById('time').innerText = t('time') + Math.floor(gameTime);
    document.getElementById('level').innerText = t('level') + gameState.player.level;
    document.getElementById('hp-bar-fill').style.width = Math.max(0, (gameState.player.hp / gameState.player.maxHp) * 100) + '%';
    document.getElementById('hp-text').innerText = Math.floor(gameState.player.hp) + '/' + Math.floor(gameState.player.maxHp);
    document.getElementById('exp-bar-fill').style.width = Math.max(0, (gameState.player.exp / gameState.player.nextLevelExp) * 100) + '%';
    document.getElementById('exp-text').innerText = Math.floor(gameState.player.exp) + '/' + gameState.player.nextLevelExp;
}

function updateInventory() {
    const inv = document.getElementById('inventory'); if (!inv || !gameState.player) return; inv.innerHTML = '';
    const createRow = (items, prefix) => {
        const row = document.createElement('div'); row.className = 'inv-row';
        items.forEach(item => {
            const container = document.createElement('div'); container.style.position = 'relative';
            const img = document.createElement('img'); img.src = 'assets/' + item.type + '.svg'; img.className = 'inv-icon';
            img.title = (prefix === 'skill_' ? t(prefix + item.type) : t(item.type + '_weapon')) || item.type;
            const badge = document.createElement('div'); badge.className = 'level-badge'; badge.innerText = 'Lv.' + item.level;
            container.appendChild(img); container.appendChild(badge); row.appendChild(container);
        });
        return row;
    };
    inv.appendChild(createRow(gameState.player.weapons, '')); inv.appendChild(createRow(gameState.player.skills, 'skill_'));
}

function getRandomRarity(isWeapon) {
    const table = isWeapon ? WEAPON_RARITIES : RARITIES; const rand = Math.random(); let cum = 0;
    for (const key in table) { cum += table[key].prob; if (rand < cum) return table[key]; }
    return table.common;
}

function showLevelUpMenu() {
    gameState.isPaused = true; audioManager.playSFX('levelup');
    const modal = document.getElementById('level-up-modal'); const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = ''; modal.classList.remove('hidden'); const p = gameState.player;
    document.getElementById('reroll-count').innerText = p.rerolls;
    document.getElementById('reroll-btn').disabled = p.rerolls <= 0;

    const options = [];
    const scale = (upgrades, rarity) => upgrades.map(u => ({ ...u, val: (['count', 'passive_amount', 'passive_armor'].includes(u.type) ? Math.ceil(u.val * rarity.mult) : u.val * rarity.mult) }));
    const getDesc = (upgrades) => upgrades.map(u => t(u.descKey) + ' (' + (['count', 'passive_amount', 'passive_armor'].includes(u.type) ? '+' + u.val : 'x' + (u.val > 0 ? (1 + u.val).toFixed(2) : (1 - u.val).toFixed(2))) + ')').join(', ');

    p.skills.forEach(s => { if (s.level < s.maxLevel) { const next = SKILL_UPGRADES[s.type].find(u => u.level === s.level + 1); if (next) { const r = getRandomRarity(false); const sc = scale(next.upgrades, r); options.push({ cat: 'label_skill', r, name: t('upgrade') + ' ' + t('skill_' + s.type) + ' (Lv ' + s.level + '->' + (s.level + 1) + '): ' + getDesc(sc), icon: 'assets/' + s.type + '.svg', action: () => { p.upgradeSkill(s.type, sc); onChoiceMade(); } }); } } });
    if (p.skills.length < p.maxSkills) ALL_SKILL_TYPES.filter(type => !p.hasSkill(type)).forEach(type => { const r = getRandomRarity(false); options.push({ cat: 'label_skill', r, name: t('skill_' + type) + ' (' + t('affects') + t(t('scope_' + type)) + '): ' + t('skill_' + type + '_desc'), icon: 'assets/' + type + '.svg', action: () => { p.addSkill(type); onChoiceMade(); } }); });
    p.weapons.forEach(w => { if (w.level < w.maxLevel) { const next = WEAPON_UPGRADES[w.type].find(u => u.level === w.level + 1); if (next) { const r = getRandomRarity(true); const sc = scale(next.upgrades, r); options.push({ cat: 'label_weapon', r, name: t('upgrade') + ' ' + t(w.type + '_weapon') + ' (Lv ' + w.level + '->' + (w.level + 1) + '): ' + getDesc(sc), icon: 'assets/' + w.type + '.svg', action: () => { w.upgrade(sc); onChoiceMade(); } }); } } });
    if (p.weapons.length < p.maxWeapons) ALL_WEAPON_TYPES.filter(type => !p.hasWeapon(type)).forEach(type => { const r = getRandomRarity(true); options.push({ cat: 'label_weapon', r, name: t(type + "_weapon"), icon: 'assets/' + type + '.svg', action: () => { p.addWeapon(type); onChoiceMade(); } }); });
    if (options.length === 0) options.push({ cat: 'label_skill', r: RARITIES.common, name: t("heal"), icon: "assets/heart.svg", action: () => { p.hp = Math.min(p.maxHp, p.hp + 50); onChoiceMade(); } });

    options.sort(() => 0.5 - Math.random()).slice(0, 3).forEach(opt => {
        const btn = document.createElement('div'); btn.className = 'level-up-option'; btn.style.borderColor = opt.r.color;
        btn.innerHTML = '<img src="' + opt.icon + '"><div style="flex-grow:1"><div style="display:flex; justify-content:space-between;"><span style="font-size:12px;color:#aaa;">' + t(opt.cat) + '</span><span style="font-size:10px;font-weight:bold;color:' + opt.r.color + '">' + t('rarity_' + opt.r.id) + '</span></div><div style="font-weight:bold;margin-top:2px;">' + opt.name + '</div></div>';
        btn.onclick = opt.action; choicesDiv.appendChild(btn);
    });
}

function onChoiceMade() { document.getElementById('level-up-modal').classList.add('hidden'); gameState.isPaused = false; lastTime = performance.now(); updateInventory(); }

window.rerollChoices = () => { if (gameState.player && gameState.player.rerolls > 0) { gameState.player.rerolls--; audioManager.playSFX('click'); showLevelUpMenu(); } };

function spawnEnemy() { const min = Math.min(9, Math.floor(gameTime / 30)); gameState.enemies.push(new Enemy(ENEMY_TYPES[min])); }

function checkCollisions() {
    const p = gameState.player; if (!p) return;
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const e = gameState.enemies[i]; if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) p.takeDamage(e.damage, audioManager, endGame);
        p.weapons.forEach(w => w.getHitboxes().forEach(h => { if (Math.hypot(h.x - e.x, h.y - e.y) < h.radius + e.radius) { const d = h.damage || w.damage * p.damageMult; e.hp -= d; audioManager.playSFX('hit'); if (gameState.showDamageNumbers) gameState.damageNumbers.push(new DamageNumber(e.x, e.y, d)); } }));
        if (e.hp <= 0) { gameState.expOrbs.push(new ExpOrb(e.x, e.y, e.exp)); gameState.enemies.splice(i, 1); }
    }
    for (let i = gameState.expOrbs.length - 1; i >= 0; i--) {
        const o = gameState.expOrbs[i]; if (Math.hypot(p.x - o.x, p.y - o.y) < p.magnetRadius) { p.exp += o.value * p.expMult; audioManager.playSFX('pickup'); if (p.exp >= p.nextLevelExp) { p.level++; p.exp -= p.nextLevelExp; p.nextLevelExp = Math.floor(p.nextLevelExp * 1.2); showLevelUpMenu(); } gameState.expOrbs.splice(i, 1); }
    }
}

function endGame() { loopRunning = false; audioManager.playSFX('gameover'); document.getElementById('game-over-modal').classList.remove('hidden'); document.getElementById('final-time').innerText = Math.floor(gameTime); }

function loop(timestamp) {
    if (!loopRunning) return; if (gameState.isPaused) { lastTime = timestamp; requestAnimationFrame(loop); return; }
    const dt = (timestamp - lastTime) / 1000; lastTime = timestamp; gameTime += dt;
    if (gameTime > nextSpawnTime) { if (gameTime >= 300) { endGame(); return; } spawnEnemy(); nextSpawnTime = gameTime + Math.max(0.2, 2.0 - (gameTime / 60)); }
    ctx.clearRect(0, 0, canvas.width, canvas.height); const p = gameState.player; p.update(keys); p.draw(ctx);
    gameState.enemies.forEach(e => { e.update(p); e.draw(ctx); }); gameState.expOrbs.forEach(o => o.draw(ctx));
    gameState.damageNumbers.forEach((d, i) => { d.update(); d.draw(ctx); if (d.life <= 0) gameState.damageNumbers.splice(i, 1); });
    checkCollisions(); updateUI(); requestAnimationFrame(loop);
}

// --- GLOBAL ATTACHMENTS ---
window.goToCharacterSelect = () => { document.getElementById('title-screen').classList.add('hidden'); document.getElementById('character-select-screen').classList.remove('hidden'); audioManager.init(); };
window.selectCharacter = (char) => { gameState.selectedCharacter = char; document.getElementById('character-select-screen').classList.add('hidden'); document.getElementById('start-screen').classList.remove('hidden'); audioManager.startBGM(); };
window.startGame = (type) => { document.getElementById('start-screen').classList.add('hidden'); gameState.player = new Player(type, gameState.selectedCharacter); gameState.enemies = []; gameState.expOrbs = []; gameState.damageNumbers = []; gameTime = 0; nextSpawnTime = 1; lastTime = performance.now(); loopRunning = true; updateInventory(); requestAnimationFrame(loop); };
window.toggleSettings = () => { document.getElementById('settings-modal').classList.toggle('hidden'); document.body.classList.toggle('settings-active'); const btn = document.getElementById('btn-toggle-dmg'); if (btn) btn.innerText = gameState.showDamageNumbers ? t('settings_hide_dmg') : t('settings_show_dmg'); };
window.toggleDamageNumbers = () => { gameState.showDamageNumbers = !gameState.showDamageNumbers; const btn = document.getElementById('btn-toggle-dmg'); if (btn) btn.innerText = gameState.showDamageNumbers ? t('settings_hide_dmg') : t('settings_show_dmg'); };
window.changeLang = (lang) => { currentLang = lang; updateTexts(); };
window.changeBGMVolume = (v) => { audioManager.bgmVolume = v / 100; if (audioManager.bgmGain) audioManager.bgmGain.gain.setTargetAtTime(audioManager.bgmVolume * 0.1, audioManager.ctx.currentTime, 0.05); document.getElementById('bgm-value').innerText = v + '%'; };
window.changeSFXVolume = (v) => { audioManager.sfxVolume = v / 100; document.getElementById('sfx-value').innerText = v + '%'; };
function updateLibrary() {
    const libWeapons = document.getElementById('lib-weapons');
    const libSkills = document.getElementById('lib-skills');
    if (!libWeapons || !libSkills) return;

    libWeapons.innerHTML = '';
    libSkills.innerHTML = '';

    ALL_WEAPON_TYPES.forEach(type => {
        const item = document.createElement('div');
        item.className = 'library-item';
        item.innerHTML = `
            <img src="assets/${type}.svg" class="lib-icon">
            <div class="lib-info">
                <div class="lib-name">${t(type + '_weapon')}</div>
                <div class="lib-desc">${t(type + '_desc')}</div>
            </div>
        `;
        libWeapons.appendChild(item);
    });

    ALL_SKILL_TYPES.forEach(type => {
        const item = document.createElement('div');
        item.className = 'library-item';
        item.innerHTML = `
            <img src="assets/${type}.svg" class="lib-icon">
            <div class="lib-info">
                <div class="lib-name">${t('skill_' + type)}</div>
                <div class="lib-desc">${t('skill_' + type + '_desc')}</div>
            </div>
        `;
        libSkills.appendChild(item);
    });
}

window.toggleLibrary = () => {
    const modal = document.getElementById('library-modal');
    if (modal.classList.contains('hidden')) {
        updateLibrary();
    }
    modal.classList.toggle('hidden');
};

// --- INIT ---
updateTexts();
