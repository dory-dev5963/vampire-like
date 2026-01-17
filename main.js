// --- CONSTANTS & CONFIG ---
const PNG_ICONS = ['cross', 'axe', 'whip', 'fire_wand', 'spear'];
function getIconPath(type, isSkill) {
    if (isSkill) return 'assets/' + type + '.svg';
    if (PNG_ICONS.includes(type)) return 'assets/' + type + '_icon.png';
    return 'assets/' + type + '.svg';
}
// Helper function to get icon for evolved weapons
function getWeaponIconPath(weaponType) {
    // Check if it's an evolved weapon - use base weapon icon
    if (typeof WEAPON_EVOLUTIONS !== 'undefined') {
        for (const [baseWeapon, evolution] of Object.entries(WEAPON_EVOLUTIONS)) {
            if (evolution.evolved === weaponType) {
                return getIconPath(baseWeapon, false);
            }
        }
    }
    return getIconPath(weaponType, false);
}
const GAME_WIDTH = 1600;
const GAME_HEIGHT = 1200;
const CLEAR_TIME = 300;
function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

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

const BOSS_TYPES = {
    minute_boss_1: { color: '#ff6b6b', speed: 1.6, hp: 2400, radius: 32, damage: 25, exp: 400, isBoss: true, glowIntensity: 0.3 },
    minute_boss_2: { color: '#ff4757', speed: 1.8, hp: 4800, radius: 36, damage: 35, exp: 600, isBoss: true, glowIntensity: 0.5 },
    minute_boss_3: { color: '#ee5a6f', speed: 2.0, hp: 8400, radius: 40, damage: 50, exp: 800, isBoss: true, glowIntensity: 0.7 },
    minute_boss_4: { color: '#c23616', speed: 2.4, hp: 13200, radius: 45, damage: 70, exp: 1200, isBoss: true, glowIntensity: 0.9 },
    final_boss: { color: '#8B0000', speed: 1.95, hp: 100000, radius: 60, damage: 80, exp: 0, isBoss: true, isFinalBoss: true, glowIntensity: 1.5, pulseEffect: true }
};

const STAGES = {
    forest: { id: 'forest', mult: 1.0, bgColor: '#1a2e1a', color: '#2ecc71' },
    library: { id: 'library', mult: 1.5, bgColor: '#1a1a2e', color: '#3498db' },
    hell: { id: 'hell', mult: 2.5, bgColor: '#2e1a1a', color: '#e74c3c' }
};

const CHARACTERS = {
    knight: { hp: 200, armor: 5, magnetRadius: 20, attackDamage: 1.1, attackFrequency: 0.9, moveSpeed: 2.2, attackSpeed: 1.0, projSpeed: 1.0, rerolls: 2, color: '#3498db' },
    rogue: { hp: 60, armor: 1, magnetRadius: 80, attackDamage: 0.8, attackFrequency: 1.5, moveSpeed: 4.8, attackSpeed: 1.2, projSpeed: 1.2, rerolls: 6, color: '#2ecc71' },
    mage: { hp: 50, armor: 1, magnetRadius: 40, attackDamage: 1.8, attackFrequency: 1.6, moveSpeed: 3.2, attackSpeed: 1.0, projSpeed: 0.8, rerolls: 3, color: '#9b59b6' }
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
        settings: "Settings", language: "Language / 言語", library: "Library", weapons: "Weapons", skills: "Skills", close: "Close", time: "Time: ", level: "Level: ", hp: "HP", exp: "EXP", evolution_guide: "Evolution Guide",
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
        game_title: "BLOOD SURVIVOR", select_weapon: "Select Weapon", choose_start_weapon: "Choose your starting weapon:", back: "Back",
        select_stage: "Select Stage", stage_forest: "Mystic Forest", stage_forest_desc: "Difficulty: Easy", stage_library: "Lost Library", stage_library_desc: "Difficulty: Normal", stage_hell: "Crimson Hell", stage_hell_desc: "Difficulty: Hard",
        cross_weapon: "Cross", cross_desc: "Boomerang attack", axe_weapon: "Axe", axe_desc: "High arc piercing attack", whip_weapon: "Whip", whip_desc: "Horizontal sweep with knockback",
        fire_wand_weapon: "Fire Wand", fire_wand_desc: "High damage fireballs", mine_weapon: "Mine", mine_desc: "Deploys explosive traps", spear_weapon: "Spear", spear_desc: "Pure piercing projectile",
        coins: "Coins: ", permanent_upgrades: "Permanent Upgrades", upgrade_shop: "Upgrade Shop", current_coins: "Current Coins: ", upgrade_base_hp: "Base HP +10",
        upgrade_base_damage: "Base Damage +5%", upgrade_base_speed: "Base Speed +5%", upgrade_rerolls: "Reroll +1", upgrade_exp_gain: "Exp Gain +10%",
        upgrade_pickup_range: "Pickup Range +10%", upgrade_armor: "Armor +1", upgrade_attack_speed: "Attack Speed +5%", upgrade_crit_rate: "Crit Rate +2%", upgrade_coin_bonus: "Coin Gain +10%", upgrade_coin_drop_rate: "Coin Drop Rate +1%",
        cost: "Cost: ", max_level: "MAX", insufficient_funds: "Not enough coins!"
    },
    ja: {
        orbit_weapon: "オービット", orbit_desc: "周囲を回転する防御オーブ", wand_weapon: "マジックワンド", wand_desc: "近くの敵を攻撃", aura_weapon: "オーラ", aura_desc: "周囲のエリアにダメージ",
        settings: "設定", language: "言語 / Language", library: "ライブラリ", weapons: "武器", skills: "スキル", close: "閉じる", time: "時間: ", level: "レベル: ", hp: "体力", exp: "経験値", evolution_guide: "進化一覧",
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
        game_title: "ブラッド・サバイバー", select_weapon: "武器の選択", choose_start_weapon: "最初の武器を選択してください:", back: "戻る",
        select_stage: "ステージの選択", stage_forest: "神秘の森", stage_forest_desc: "難易度: イージー", stage_library: "失われた図書館", stage_library_desc: "難易度: ノーマル", stage_hell: "紅蓮の地獄", stage_hell_desc: "難易度: ハード",
        cross_weapon: "十字架", cross_desc: "ブーメラン攻撃", axe_weapon: "手斧", axe_desc: "放物線を描く貫通攻撃", whip_weapon: "ムチ", whip_desc: "水平方向へのなぎ払い攻撃",
        fire_wand_weapon: "ファイアワンド", fire_wand_desc: "高火力の火球攻撃", mine_weapon: "地雷", mine_desc: "接触で爆発する罠を設置", spear_weapon: "槍", spear_desc: "敵を貫通する直線攻撃",
        coins: "コイン: ", permanent_upgrades: "永続強化", upgrade_shop: "強化ショップ", current_coins: "所持コイン: ", upgrade_base_hp: "基礎HP +10",
        upgrade_base_damage: "基礎攻撃力 +5%", upgrade_base_speed: "基礎速度 +5%", upgrade_rerolls: "リロール数 +1", upgrade_exp_gain: "経験値獲得 +10%",
        upgrade_pickup_range: "アイテム取得範囲 +10%", upgrade_armor: "ダメージ軽減 +1", upgrade_attack_speed: "攻撃速度 +5%", upgrade_crit_rate: "クリティカル率 +2%", upgrade_coin_bonus: "コイン獲得量 +10%", upgrade_coin_drop_rate: "コイン取得率 +1%",
        cost: "コスト: ", max_level: "最大", insufficient_funds: "コインが不足しています！"
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
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = this.bgmVolume * 0.4; // Increased from 0.1
            this.bgmGain.connect(this.ctx.destination);
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
            if (!this.ctx || !this.bgmGain) return;
            const osc = this.ctx.createOscillator(); const g = this.ctx.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, time);
            g.gain.setValueAtTime(0, time);
            g.gain.linearRampToValueAtTime(0.3, time + 0.05); // Increased from 0.1
            g.gain.exponentialRampToValueAtTime(0.001, time + dur);
            osc.connect(g); g.connect(this.bgmGain); osc.start(time); osc.stop(time + dur);
        };
        const melody = [261.63, 0, 329.63, 0, 392.00, 0, 329.63, 0];
        const loopMelody = () => {
            if (!this.bgmStarted || !this.ctx) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 8; i++) {
                const freq = melody[i];
                if (freq > 0) playNote(freq, now + i * 0.5, 0.45);
            }
            setTimeout(loopMelody, 4000);
        };
        loopMelody();
    }
}
const audioManager = new AudioManager();

// --- ENTITIES ---
class Particle {
    constructor(x, y, color, speed, angle, life) {
        this.x = x; this.y = y; this.color = color;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.life = life; this.maxLife = life; this.size = Math.random() * 3 + 1;
    }
    update() { this.x += this.vx; this.y += this.vy; this.life--; }
    draw(ctx) {
        ctx.globalAlpha = this.life / this.maxLife; ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class BossProjectile {
    constructor(x, y, targetX, targetY, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.radius = 8;
        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    draw(ctx) {
        // Dark energy ball with red glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, '#8B0000');
        gradient.addColorStop(0.5, '#ff0000');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        if (Math.random() > 0.5) {
            gameState.particles.push(new Particle(this.x, this.y, '#8B0000', Math.random() * 0.5, Math.random() * Math.PI * 2, 15));
        }
    }
    isOffScreen() {
        return this.x < -50 || this.x > GAME_WIDTH + 50 || this.y < -50 || this.y > GAME_HEIGHT + 50;
    }
}

class Enemy {
    constructor(type) {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = Math.random() * GAME_WIDTH; this.y = -20; }
        else if (side === 1) { this.x = GAME_WIDTH + 20; this.y = Math.random() * GAME_HEIGHT; }
        else if (side === 2) { this.x = Math.random() * GAME_WIDTH; this.y = GAME_HEIGHT + 20; }
        else { this.x = -20; this.y = Math.random() * GAME_HEIGHT; }
        const mult = (gameState.selectedStage ? STAGES[gameState.selectedStage].mult : 1.0);
        this.radius = type.radius; this.speed = type.speed + Math.random() * 0.3; this.hp = type.hp * mult; this.damage = type.damage * mult; this.color = type.color; this.exp = type.exp || 5;
    }
    update(target) {
        // Update status effect timers
        if (this.slowTimer) {
            this.slowTimer--;
            if (this.slowTimer <= 0) {
                this.speed = this.baseSpeed || this.speed;
                this.slowed = false;
            }
        }
        
        if (this.defenseDownTimer) {
            this.defenseDownTimer--;
            if (this.defenseDownTimer <= 0) {
                this.defenseDown = 0;
            }
        }
        
        if (this.stunnedTimer) {
            this.stunnedTimer--;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
            }
        }
        
        if (this.knockbackTimer) {
            this.knockbackTimer--;
            this.x += this.knockbackX / 10;
            this.y += this.knockbackY / 10;
            if (this.knockbackTimer <= 0) {
                this.knockbackX = 0;
                this.knockbackY = 0;
            }
            return; // Don't move toward player during knockback
        }
        
        if (this.burning) {
            this.burnTickTimer = (this.burnTickTimer || 0) + 1;
            if (this.burnTickTimer >= 60) {
                this.hp -= this.burnDamage;
                this.burnTickTimer = 0;
                // Burn particles
                for (let i = 0; i < 3; i++) {
                    gameState.particles.push(new Particle(this.x, this.y, '#e67e22', Math.random() * 2, Math.random() * Math.PI * 2, 20));
                }
            }
            this.burnTimer--;
            if (this.burnTimer <= 0) {
                this.burning = false;
            }
        }
        
        // Don't move if stunned
        if (this.stunned) return;
        
        // Boss projectile attacks
        if (this.isBoss) {
            if (!this.attackTimer) this.attackTimer = 0;
            if (!this.attackPattern) this.attackPattern = 0;
            this.attackTimer++;
            
            if (this.isFinalBoss) {
                // Final boss - complex bullet hell patterns
                if (this.attackTimer >= 30) { // Fire every 0.5 seconds (3x faster)
                    this.attackTimer = 0;
                    this.attackPattern = (this.attackPattern + 1) % 3;
                    
                    if (this.attackPattern === 0) {
                        // Spiral pattern - 8 projectiles in a circle
                        for (let i = 0; i < 8; i++) {
                            const angle = (Math.PI * 2 * i / 8) + gameTime * 2;
                            const offsetX = Math.cos(angle) * this.radius;
                            const offsetY = Math.sin(angle) * this.radius;
                            gameState.bossProjectiles.push(
                                new BossProjectile(
                                    this.x + offsetX, 
                                    this.y + offsetY, 
                                    this.x + Math.cos(angle) * 500,
                                    this.y + Math.sin(angle) * 500,
                                    this.damage * 0.4
                                )
                            );
                        }
                    } else if (this.attackPattern === 1) {
                        // Aimed spread - 5 projectiles toward player
                        const baseAngle = Math.atan2(target.y - this.y, target.x - this.x);
                        for (let i = 0; i < 5; i++) {
                            const spreadAngle = (i - 2) * 0.25;
                            const angle = baseAngle + spreadAngle;
                            const offsetX = Math.cos(angle) * this.radius;
                            const offsetY = Math.sin(angle) * this.radius;
                            gameState.bossProjectiles.push(
                                new BossProjectile(
                                    this.x + offsetX, 
                                    this.y + offsetY, 
                                    target.x + Math.cos(angle) * 100, 
                                    target.y + Math.sin(angle) * 100, 
                                    this.damage * 0.5
                                )
                            );
                        }
                    } else {
                        // Cross pattern - 4 directions
                        for (let i = 0; i < 4; i++) {
                            const angle = (Math.PI / 2 * i) + (Math.PI / 4);
                            for (let j = 0; j < 3; j++) {
                                const offsetX = Math.cos(angle) * (this.radius + j * 15);
                                const offsetY = Math.sin(angle) * (this.radius + j * 15);
                                gameState.bossProjectiles.push(
                                    new BossProjectile(
                                        this.x + offsetX, 
                                        this.y + offsetY, 
                                        this.x + Math.cos(angle) * 600,
                                        this.y + Math.sin(angle) * 600,
                                        this.damage * 0.35
                                    )
                                );
                            }
                        }
                    }
                    audioManager.playSFX('hit');
                }
            } else {
                // Regular bosses - simpler attacks
                if (this.attackTimer >= 75) { // Fire every 1.25 seconds (2x faster)
                    this.attackTimer = 0;
                    // Fire 4-5 projectiles toward player
                    const baseAngle = Math.atan2(target.y - this.y, target.x - this.x);
                    const projectileCount = 4 + Math.floor(this.glowIntensity * 2); // 4-5 projectiles
                    for (let i = 0; i < projectileCount; i++) {
                        const spreadAngle = (i - (projectileCount - 1) / 2) * 0.4;
                        const angle = baseAngle + spreadAngle;
                        const offsetX = Math.cos(angle) * this.radius;
                        const offsetY = Math.sin(angle) * this.radius;
                        gameState.bossProjectiles.push(
                            new BossProjectile(
                                this.x + offsetX, 
                                this.y + offsetY, 
                                target.x, 
                                target.y, 
                                this.damage * 0.4
                            )
                        );
                    }
                    audioManager.playSFX('hit');
                }
            }
        }
        
        const dx = target.x - this.x; const dy = target.y - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) { this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed; }
    }
    draw(ctx) {
        const bounce = Math.sin(gameTime * 10) * 2;
        const r = this.radius + bounce;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Status effect indicators
        if (this.stunned) {
            // Lightning effect around stunned enemy
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 * i) / 4 + gameTime * 5;
                const x1 = Math.cos(angle) * (r + 5);
                const y1 = Math.sin(angle) * (r + 5);
                const x2 = Math.cos(angle) * (r + 10);
                const y2 = Math.sin(angle) * (r + 10);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
        
        if (this.slowed) {
            // Blue ice effect around slowed enemy
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        if (this.burning) {
            // Fire particles around burning enemy
            const fireAlpha = 0.4 + Math.sin(gameTime * 10) * 0.2;
            ctx.fillStyle = `rgba(230, 126, 34, ${fireAlpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, r + 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (this.defenseDown) {
            // Purple defense down indicator
            ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Boss glow effect
        if (this.isBoss && this.glowIntensity) {
            const glowRadius = r + 10 * this.glowIntensity;
            const gradient = ctx.createRadialGradient(0, 0, r, 0, 0, glowRadius);
            const alpha = this.pulseEffect ? (0.3 + Math.sin(gameTime * 3) * 0.2) : 0.3;
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Final boss pulse effect
        if (this.isFinalBoss && this.pulseEffect) {
            const pulseSize = r * (1 + Math.sin(gameTime * 4) * 0.1);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Boss outer ring
        if (this.isBoss) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = this.isFinalBoss ? 4 : 2;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Horns/Spikes for stronger enemies and bosses
        if (this.radius > 15 || this.isBoss) {
            const spikeCount = this.isFinalBoss ? 8 : this.isBoss ? 6 : 3;
            const spikeLength = this.isFinalBoss ? 20 : this.isBoss ? 15 : 10;
            ctx.fillStyle = this.isFinalBoss ? '#000000' : '#2c3e50';
            for (let i = 0; i < spikeCount; i++) {
                const angle = (Math.PI * 2 * i) / spikeCount + gameTime * (this.isFinalBoss ? 2 : 1);
                const x1 = Math.cos(angle) * r;
                const y1 = Math.sin(angle) * r;
                const x2 = Math.cos(angle) * (r + spikeLength);
                const y2 = Math.sin(angle) * (r + spikeLength);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(Math.cos(angle + 0.2) * r, Math.sin(angle + 0.2) * r);
                ctx.fill();
            }
        }

        // Eyes
        const eyeSize = this.isFinalBoss ? r * 0.3 : r * 0.25;
        ctx.fillStyle = this.isFinalBoss ? '#ff0000' : 'white';
        ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.2, eyeSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(r * 0.4, -r * 0.2, eyeSize, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = this.isFinalBoss ? '#000000' : 'black';
        const pupilSize = this.isFinalBoss ? r * 0.15 : r * 0.1;
        ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.2, pupilSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(r * 0.4, -r * 0.2, pupilSize, 0, Math.PI * 2); ctx.fill();

        // Angry brows - more intense for bosses
        ctx.strokeStyle = this.isFinalBoss ? '#ffffff' : 'black';
        ctx.lineWidth = this.isBoss ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.5); ctx.lineTo(-r * 0.1, -r * 0.2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(r * 0.7, -r * 0.5); ctx.lineTo(r * 0.1, -r * 0.2); ctx.stroke();

        // Final boss additional features
        if (this.isFinalBoss) {
            // Crown/horns
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(-r * 0.6, -r * 0.8);
            ctx.lineTo(-r * 0.5, -r * 1.2);
            ctx.lineTo(-r * 0.3, -r * 0.9);
            ctx.lineTo(0, -r * 1.3);
            ctx.lineTo(r * 0.3, -r * 0.9);
            ctx.lineTo(r * 0.5, -r * 1.2);
            ctx.lineTo(r * 0.6, -r * 0.8);
            ctx.fill();
        }

        ctx.restore();
    }
}

class ExpOrb {
    constructor(x, y, value) {
        this.x = x; this.y = y; this.value = value; this.radius = 4;
        if (value >= 100) { this.color = '#9b59b6'; this.radius = 8; }
        else if (value >= 25) { this.color = '#f1c40f'; this.radius = 6; }
        else if (value >= 10) { this.color = '#3498db'; this.radius = 5; }
        else { this.color = '#2ecc71'; }
    }
    draw(ctx) { ctx.globalAlpha = 0.5; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1.0; }
}

class Coin {
    constructor(x, y, value) {
        this.x = x; this.y = y; this.value = value; this.radius = 6;
        this.color = '#FFD700';
        this.pulseTimer = 0;
    }
    draw(ctx) {
        this.pulseTimer += 0.1;
        const pulse = Math.sin(this.pulseTimer) * 0.5 + 0.5;
        const currentRadius = this.radius * (1 + pulse * 0.3);
        
        // Glow effect
        ctx.globalAlpha = 0.3;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentRadius * 2);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin body
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

class DamageNumber {
    constructor(x, y, value, isHeal = false, isCrit = false) { 
        this.x = x; this.y = y; this.value = Math.floor(value); this.life = 60; this.vy = -1; this.alpha = 1.0; this.isHeal = isHeal; this.isCrit = isCrit;
        if (isHeal) { 
            this.colorStr = '46, 204, 113'; 
        } else if (isCrit) {
            this.colorStr = '241, 196, 15'; // Gold for crit
        } else { 
            const gb = Math.floor(Math.max(50, 255 - (this.value * 3))); 
            this.colorStr = `255, ${gb}, ${gb}`; 
        } 
    }
    update() { this.y += this.vy; this.life--; this.alpha = Math.max(0, this.life / 30); }
    draw(ctx) { 
        ctx.fillStyle = `rgba(${this.colorStr}, ${this.alpha})`; 
        const fontSize = this.isCrit ? 28 : 20;
        ctx.font = `bold ${fontSize}px sans-serif`; 
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha})`; 
        ctx.lineWidth = 3; 
        ctx.textAlign = 'center'; 
        const text = this.isHeal ? '+' + this.value : (this.isCrit ? this.value + '!' : this.value); 
        if (this.isCrit) {
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#f1c40f';
        }
        ctx.strokeText(text, this.x, this.y); 
        ctx.fillText(text, this.x, this.y); 
        if (this.isCrit) {
            ctx.restore();
        }
    }
}

class TreasureChest {
    constructor(x, y, rewardCount) {
        this.x = x; this.y = y; this.radius = 25; this.rewardCount = rewardCount;
        this.pulseTimer = 0; this.collected = false;
        this.color = rewardCount === 5 ? '#f1c40f' : rewardCount === 3 ? '#3498db' : '#95a5a6';
        this.sparkleTimer = 0;
    }
    draw(ctx) {
        if (this.collected) return; // Don't draw collected chests
        this.pulseTimer += 0.15;
        this.sparkleTimer += 0.1;
        const pulse = Math.sin(this.pulseTimer) * 4;
        const r = this.radius + pulse;
        
        // Strong outer glow
        const outerGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 3);
        outerGrad.addColorStop(0, this.color + 'CC');
        outerGrad.addColorStop(0.5, this.color + '66');
        outerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner glow
        const innerGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 1.5);
        innerGrad.addColorStop(0, this.color);
        innerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkles
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.sparkleTimer;
            const dist = r * 2;
            const sx = this.x + Math.cos(angle) * dist;
            const sy = this.y + Math.sin(angle) * dist;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(sx, sy, 2 + Math.sin(this.sparkleTimer * 2 + i) * 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Chest body (larger)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 18, this.y - 12, 36, 24);
        
        // Chest lid (larger)
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x - 20, this.y - 18, 40, 12);
        
        // Lock (larger)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkles for higher rarity
        if (this.rewardCount >= 3) {
            for (let i = 0; i < 3; i++) {
                const angle = this.pulseTimer * 2 + (i * Math.PI * 2 / 3);
                const dist = 20 + pulse;
                const sx = this.x + Math.cos(angle) * dist;
                const sy = this.y + Math.sin(angle) * dist;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
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
    ],
    cross: [{ level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 3, upgrades: [{ type: 'passive_speed', val: 0.2, descKey: 'upgrade_speed' }] }, { level: 4, upgrades: [{ type: 'passive_damage', val: 5, descKey: 'upgrade_damage_flat' }] }, { level: 5, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 6, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] }],
    axe: [{ level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 3, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] }, { level: 4, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] }, { level: 5, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 6, upgrades: [{ type: 'passive_damage', val: 20, descKey: 'upgrade_damage_flat' }] }],
    whip: [{ level: 2, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] }, { level: 3, upgrades: [{ type: 'passive_damage', val: 5, descKey: 'upgrade_damage_flat' }] }, { level: 4, upgrades: [{ type: 'passive_area', val: 0.2, descKey: 'upgrade_area' }] }, { level: 5, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] }, { level: 6, upgrades: [{ type: 'passive_area', val: 0.4, descKey: 'upgrade_area' }] }],
    fire_wand: [{ level: 2, upgrades: [{ type: 'passive_damage', val: 20, descKey: 'upgrade_damage_flat' }] }, { level: 3, upgrades: [{ type: 'passive_speed', val: 0.2, descKey: 'upgrade_speed' }] }, { level: 4, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 5, upgrades: [{ type: 'passive_damage', val: 40, descKey: 'upgrade_damage_flat' }] }, { level: 6, upgrades: [{ type: 'count', val: 2, descKey: 'upgrade_amount' }] }],
    mine: [{ level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 3, upgrades: [{ type: 'passive_area', val: 0.3, descKey: 'upgrade_area' }] }, { level: 4, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] }, { level: 5, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 6, upgrades: [{ type: 'passive_area', val: 0.5, descKey: 'upgrade_area' }] }],
    spear: [{ level: 2, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 3, upgrades: [{ type: 'passive_damage', val: 10, descKey: 'upgrade_damage_flat' }] }, { level: 4, upgrades: [{ type: 'passive_proj_speed', val: 0.2, descKey: 'upgrade_speed' }] }, { level: 5, upgrades: [{ type: 'count', val: 1, descKey: 'upgrade_amount' }] }, { level: 6, upgrades: [{ type: 'passive_damage', val: 20, descKey: 'upgrade_damage_flat' }] }]
};

const SKILL_UPGRADES = {
    muscle: [{ level: 1, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 2, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 3, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 4, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 5, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }, { level: 6, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] }],
    heart: [{ level: 1, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 2, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 3, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 4, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 5, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }, { level: 6, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] }],
    tome: [{ level: 1, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 2, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 3, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 4, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 5, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }, { level: 6, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] }],
    scope: [{ level: 1, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 2, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 3, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 4, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 5, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }, { level: 6, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] }],
    duplicator: [{ level: 1, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 2, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 3, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 4, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 5, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }, { level: 6, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] }],
    magnet: [{ level: 1, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 2, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 3, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 4, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 5, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }, { level: 6, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] }],
    wings: [{ level: 1, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 2, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 3, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 4, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 5, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }, { level: 6, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] }],
    crown: [{ level: 1, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 2, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 3, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 4, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 5, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }, { level: 6, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] }],
    armor: [{ level: 1, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 2, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 3, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 4, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 5, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }, { level: 6, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] }],
    pummarola: [{ level: 1, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 2, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 3, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 4, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 5, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }, { level: 6, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] }],
    bracer: [{ level: 1, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 2, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 3, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 4, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 5, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }, { level: 6, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] }],
    spellbinder: [{ level: 1, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 2, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 3, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 4, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 5, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }, { level: 6, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] }]
};

const ALL_WEAPON_TYPES = ['orbit', 'wand', 'aura', 'knife', 'holy_water', 'lightning', 'cross', 'axe', 'whip', 'fire_wand', 'mine', 'spear'];
const ALL_SKILL_TYPES = ['muscle', 'heart', 'tome', 'scope', 'duplicator', 'magnet', 'wings', 'crown', 'armor', 'pummarola', 'bracer', 'spellbinder'];

// Weapon Evolution Mappings
const WEAPON_EVOLUTIONS = {
    orbit: { skill: 'duplicator', evolved: 'celestial_orbit', name: '天体オービット' },
    wand: { skill: 'tome', evolved: 'arcane_wand', name: '秘術の杖' },
    aura: { skill: 'scope', evolved: 'divine_aura', name: '神聖オーラ' },
    knife: { skill: 'wings', evolved: 'deadly_blade', name: '致命の刃' },
    holy_water: { skill: 'spellbinder', evolved: 'blessed_flood', name: '祝福の洪水' },
    lightning: { skill: 'muscle', evolved: 'thunder_storm', name: '雷嵐' },
    cross: { skill: 'bracer', evolved: 'holy_boomerang', name: '聖なるブーメラン' },
    axe: { skill: 'armor', evolved: 'great_axe', name: '大斧' },
    whip: { skill: 'heart', evolved: 'dragon_whip', name: '竜の鞭' },
    fire_wand: { skill: 'crown', evolved: 'inferno', name: '業火' },
    mine: { skill: 'magnet', evolved: 'mine_field', name: '地雷原' },
    spear: { skill: 'pummarola', evolved: 'javelin', name: '投槍' }
};

function applyUpgrade(weapon, upgradeInfo) {
    switch (upgradeInfo.type) {
        case 'passive_damage': weapon.damage *= (1 + upgradeInfo.val); break;
        case 'passive_speed': weapon.cooldown *= (1 - upgradeInfo.val); break;
        case 'passive_area': if (weapon.radius !== undefined) weapon.radius *= (1 + upgradeInfo.val); if (weapon.range !== undefined) weapon.range *= (1 + upgradeInfo.val); if (weapon.projectileSize !== undefined) weapon.projectileSize *= (1 + upgradeInfo.val); break;
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
    constructor(owner) { this.owner = owner; this.radius = 60; this.projectileRadius = 10; this.angle = 0; this.projectileCount = 2; this.rotationSpeed = 0.05; this.damage = 15; this.type = 'orbit'; this.level = 1; this.maxLevel = 6; this.timer = 0; this.cooldown = 1; }
    update() {
        this.angle += 0.05 * this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult;
        this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effective) { this.timer = 0; }
    }
    draw(ctx) {
        const total = this.projectileCount + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            const currentAngle = this.angle + (i * Math.PI * 2) / total;
            const x = this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult);
            const y = this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult);

            // Outer glow
            const grad = ctx.createRadialGradient(x, y, 0, x, y, this.projectileRadius * 2);
            grad.addColorStop(0, '#3498db'); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, this.projectileRadius * 2, 0, Math.PI * 2); ctx.fill();

            // Core
            ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(x, y, this.projectileRadius, 0, Math.PI * 2); ctx.fill();

            // Trail
            if (Math.random() > 0.5) gameState.particles.push(new Particle(x, y, '#3498db', Math.random() * 1, Math.random() * Math.PI * 2, 20));
        }
    }
    getHitboxes() { const boxes = []; const total = this.projectileCount + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const currentAngle = this.angle + (i * Math.PI * 2) / total; boxes.push({ x: this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult), y: this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult), radius: this.projectileRadius, damage: this.damage * this.owner.damageMult }); } return boxes; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

// === EVOLVED WEAPONS ===
class CelestialOrbitWeapon {
    constructor(owner) {
        this.owner = owner;
        this.radius = 80;
        this.projectileRadius = 15;
        this.angle = 0;
        this.projectileCount = 6;
        this.rotationSpeed = 0.08;
        this.damage = 30;
        this.type = 'celestial_orbit';
        this.level = 1;
        this.maxLevel = 1; // No level ups
        this.particleTimer = 0;
        this.slow = 0.3; // 30% slow effect
    }
    update() {
        this.angle += this.rotationSpeed * this.owner.attackFrequency * this.owner.attackSpeed;
        this.particleTimer++;
    }
    draw(ctx) {
        const total = this.projectileCount + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            const currentAngle = this.angle + (i * Math.PI * 2) / total;
            const x = this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult);
            const y = this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult);

            // Star-like glow effect
            const grad = ctx.createRadialGradient(x, y, 0, x, y, this.projectileRadius * 3);
            grad.addColorStop(0, '#f1c40f');
            grad.addColorStop(0.3, '#3498db');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, this.projectileRadius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Bright core with star shape
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#f1c40f';
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
                const starAngle = (s / 5) * Math.PI * 2 + this.angle * 2;
                const starRadius = s % 2 === 0 ? this.projectileRadius : this.projectileRadius * 0.5;
                const sx = x + Math.cos(starAngle) * starRadius;
                const sy = y + Math.sin(starAngle) * starRadius;
                if (s === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Trailing particles (controlled rate)
            if (this.particleTimer % 3 === 0 && Math.random() > 0.7) {
                gameState.particles.push(new Particle(x, y, Math.random() > 0.5 ? '#f1c40f' : '#3498db', Math.random() * 2, Math.random() * Math.PI * 2, 30));
            }
        }
    }
    getHitboxes() {
        const boxes = [];
        const total = this.projectileCount + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            const currentAngle = this.angle + (i * Math.PI * 2) / total;
            boxes.push({
                x: this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult),
                y: this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult),
                radius: this.projectileRadius,
                damage: this.damage * this.owner.damageMult
            });
        }
        return boxes;
    }
    upgrade(custom) { /* No upgrades for evolved weapons */ }
}

class WandWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 60; this.timer = 0; this.projectileSpeed = 7; this.projectileSize = 6; this.damage = 10; this.count = 1; this.type = 'wand'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < 0 || p.x > GAME_WIDTH || p.y < 0 || p.y > GAME_HEIGHT) this.projectiles.splice(i, 1); } }
    fire() {
        const total = this.count + this.owner.projectileCountBonus;
        let target = null;
        let minDist = Infinity;
        gameState.enemies.forEach(e => {
            const d = Math.hypot(e.x - this.owner.x, e.y - this.owner.y);
            if (d < minDist) { minDist = d; target = e; }
        });

        const baseAngle = target ? Math.atan2(target.y - this.owner.y, target.x - this.owner.x) : 0;
        const spreadAngle = Math.PI / 8; // 22.5度の広がり

        for (let i = 0; i < total; i++) {
            const offset = total > 1 ? (i - (total - 1) / 2) * (spreadAngle / Math.max(1, total - 1)) : 0;
            const angle = baseAngle + offset;
            const dx = Math.cos(angle) * this.projectileSpeed * this.owner.projectileSpeedMult;
            const dy = Math.sin(angle) * this.projectileSpeed * this.owner.projectileSpeedMult;
            this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx, dy, radius: this.projectileSize, damage: this.damage * this.owner.damageMult });
        }
    }
    draw(ctx) { ctx.fillStyle = '#3498db'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class AuraWeapon {
    constructor(owner) { this.owner = owner; this.radius = 80; this.damage = 1; this.damageInterval = 30; this.timer = 0; this.type = 'aura'; this.level = 1; this.maxLevel = 6; this.pulse = 0; }
    update() {
        this.timer++; this.pulse = (this.pulse + 0.05) % 1;
        const effective = this.damageInterval / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effective) { this.timer = 0; this.shouldDamage = true; } else this.shouldDamage = false;
    }
    draw(ctx) {
        const r = this.radius * this.owner.areaMult;
        ctx.strokeStyle = `rgba(46, 204, 113, ${1 - this.pulse})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.owner.x, this.owner.y, r * this.pulse, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = 'rgba(46, 204, 113, 0.1)';
        ctx.beginPath(); ctx.arc(this.owner.x, this.owner.y, r, 0, Math.PI * 2); ctx.fill();
    }
    getHitboxes() { if (!this.shouldDamage) return []; return [{ x: this.owner.x, y: this.owner.y, radius: this.radius * this.owner.areaMult, damage: Math.max(1, Math.floor(this.damage * this.owner.damageMult)) }]; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class KnifeWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 45; this.timer = 0; this.projectileSpeed = 10; this.projectileSize = 4; this.damage = 12; this.projectileCount = 1; this.type = 'knife'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < 0 || p.x > GAME_WIDTH || p.y < 0 || p.y > GAME_HEIGHT) this.projectiles.splice(i, 1); } }
    fire() {
        const total = this.projectileCount + this.owner.projectileCountBonus;
        let target = null;
        let minDist = Infinity;
        gameState.enemies.forEach(e => {
            const d = Math.hypot(e.x - this.owner.x, e.y - this.owner.y);
            if (d < minDist) { minDist = d; target = e; }
        });

        const baseAngle = target ? Math.atan2(target.y - this.owner.y, target.x - this.owner.x) : 0;
        const speed = this.projectileSpeed * this.owner.projectileSpeedMult;

        for (let i = 0; i < total; i++) {
            const spread = (i - (total - 1) / 2) * 0.2;
            const angle = baseAngle + spread;
            this.projectiles.push({
                x: this.owner.x,
                y: this.owner.y,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                radius: this.projectileSize,
                damage: this.damage * this.owner.damageMult
            });
        }
    }
    draw(ctx) { ctx.fillStyle = '#ecf0f1'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class HolyWaterWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 120; this.timer = 0; this.duration = 180; this.radius = 40; this.damage = 10; this.throwSpeed = 8; this.count = 1; this.type = 'holy_water'; this.level = 1; this.maxLevel = 6; this.zones = []; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; p.life--; if (p.life <= 0) { this.zones.push({ x: p.x, y: p.y, radius: this.radius * this.owner.areaMult, life: this.duration * this.owner.durationMult, maxLife: this.duration * this.owner.durationMult, damage: this.damage * this.owner.damageMult }); this.projectiles.splice(i, 1); } } for (let i = this.zones.length - 1; i >= 0; i--) { const z = this.zones[i]; z.life--; if (z.life <= 0) this.zones.splice(i, 1); } }
    fire() { const total = this.count + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const angle = Math.random() * Math.PI * 2; const dist = 100 + Math.random() * 100; const travelTime = Math.max(5, 30 / this.owner.projectileSpeedMult); this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: (dist * Math.cos(angle)) / travelTime, dy: (dist * Math.sin(angle)) / travelTime, life: travelTime }); } }
    draw(ctx) { ctx.fillStyle = '#3498db'; this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); }); this.zones.forEach(z => { const alpha = (z.life / z.maxLife) * 0.6; ctx.fillStyle = `rgba(155, 89, 182, ${alpha})`; ctx.beginPath(); ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2); ctx.fill(); }); }
    getHitboxes() { return this.zones; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class LightningWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 90; this.timer = 0; this.damage = 30; this.chainCount = 2; this.range = 200; this.activeChain = []; this.chainTimer = 0; this.type = 'lightning'; this.level = 1; this.maxLevel = 6; this.strikes = []; }
    update() {
        this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effective) {
            this.timer = 0;
            const player = this.owner;
            let currentSource = player;
            let hit = [];
            for (let i = 0; i < this.chainCount + this.owner.projectileCountBonus; i++) {
                let nearest = null;
                let minDist = this.range * this.owner.areaMult;
                gameState.enemies.forEach(e => {
                    if (!hit.includes(e)) {
                        const d = Math.hypot(currentSource.x - e.x, currentSource.y - e.y);
                        if (d < minDist) { minDist = d; nearest = e; }
                    }
                });
                if (nearest) {
                    hit.push(nearest);
                    const dmg = this.damage * player.damageMult;
                    nearest.hp -= dmg;
                    if (gameState.showDamageNumbers) gameState.damageNumbers.push(new DamageNumber(nearest.x, nearest.y, dmg));
                    currentSource = nearest;
                } else break;
            }
            if (hit.length > 0) {
                this.strikes.push({
                    life: 15, // Duration of the lightning bolt
                    points: this.generateLightningPoints(player.x, player.y, hit[0].x, hit[0].y),
                    targets: hit
                });
            }
        }
        for (let i = this.strikes.length - 1; i >= 0; i--) {
            this.strikes[i].life--;
            if (this.strikes[i].life <= 0) this.strikes.splice(i, 1);
        }
    }
    generateLightningPoints(x1, y1, x2, y2) {
        const pts = [{ x: x1, y: y1 }];
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const segments = Math.max(3, Math.floor(dist / 50)); // More segments for longer bolts
        for (let i = 1; i < segments; i++) {
            const rx = x1 + (x2 - x1) * (i / segments) + (Math.random() - 0.5) * 30; // Random offset
            const ry = y1 + (y2 - y1) * (i / segments) + (Math.random() - 0.5) * 30;
            pts.push({ x: rx, y: ry });
        }
        pts.push({ x: x2, y: y2 });
        return pts;
    }
    draw(ctx) {
        ctx.strokeStyle = '#f1c40f';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f1c40f';
        this.strikes.forEach(s => {
            ctx.lineWidth = 2 * (s.life / 15); // Fade out effect
            ctx.beginPath();
            ctx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
                ctx.lineTo(s.points[i].x, s.points[i].y);
            }
            ctx.stroke();
            // Sparkles at impact points
            s.targets.forEach(target => {
                for (let j = 0; j < 3; j++) {
                    gameState.particles.push(new Particle(target.x, target.y, '#f1c40f', Math.random() * 2, Math.random() * Math.PI * 2, 10));
                }
            });
        });
        ctx.shadowBlur = 0;
    }
    getHitboxes() { return []; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class CrossWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 80; this.timer = 0; this.projectileSpeed = 8; this.projectileSize = 8; this.damage = 15; this.count = 1; this.type = 'cross'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; if (!p.returning) { p.x += p.dx; p.y += p.dy; p.life--; if (p.life <= 0) p.returning = true; } else { const dx = this.owner.x - p.x; const dy = this.owner.y - p.y; const d = Math.hypot(dx, dy); if (d < 10) this.projectiles.splice(i, 1); else { p.x += (dx / d) * (this.projectileSpeed * 1.5); p.y += (dy / d) * (this.projectileSpeed * 1.5); } } } }
    fire() {
        const total = this.count + this.owner.projectileCountBonus;
        let target = null;
        let minDist = Infinity;
        gameState.enemies.forEach(e => {
            const d = Math.hypot(e.x - this.owner.x, e.y - this.owner.y);
            if (d < minDist) { minDist = d; target = e; }
        });

        const baseAngle = target ? Math.atan2(target.y - this.owner.y, target.x - this.owner.x) : 0;
        const spread = Math.PI / 4; // 45 degree spread

        for (let i = 0; i < total; i++) {
            const angle = total > 1 ? baseAngle - spread / 2 + (i / (total - 1)) * spread : baseAngle;
            this.projectiles.push({
                x: this.owner.x, y: this.owner.y,
                dx: Math.cos(angle) * this.projectileSpeed * this.owner.projectileSpeedMult,
                dy: Math.sin(angle) * this.projectileSpeed * this.owner.projectileSpeedMult,
                radius: this.projectileSize, damage: this.damage * this.owner.damageMult,
                returning: false, life: 60
            });
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#f1c40f'; ctx.shadowBlur = 5; ctx.shadowColor = '#f1c40f';
        this.projectiles.forEach(p => {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(gameTime * 10);
            ctx.beginPath(); ctx.moveTo(0, -p.radius); ctx.lineTo(p.radius, 0); ctx.lineTo(0, p.radius); ctx.lineTo(-p.radius, 0); ctx.closePath(); ctx.fill();
            ctx.restore();
            // Trail particles
            if (Math.random() > 0.5) gameState.particles.push(new Particle(p.x, p.y, '#f1c40f', 0.2, Math.random() * Math.PI * 2, 10));
        });
        ctx.shadowBlur = 0;
    }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class AxeWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 100; this.timer = 0; this.projectileSpeed = 10; this.projectileSize = 10; this.radius = 10; this.damage = 25; this.count = 1; this.type = 'axe'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; p.dy += 0.2; if (p.y > GAME_HEIGHT + 50) this.projectiles.splice(i, 1); } }
    fire() { const total = this.count + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: (Math.random() - 0.5) * 10, dy: -12, radius: this.radius, damage: this.damage * this.owner.damageMult }); } }
    draw(ctx) {
        ctx.fillStyle = '#95a5a6';
        this.projectiles.forEach(p => {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(gameTime * 8);
            ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI, true); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
            ctx.restore();
        });
    }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class WhipWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 60; this.timer = 0; this.range = 100; this.height = 30; this.damage = 15; this.type = 'whip'; this.level = 1; this.maxLevel = 6; this.activeTime = 0; this.direction = 1; }
    update() {
        this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effective) { this.timer = 0; this.activeTime = 10; this.direction = (Math.random() > 0.5 ? 1 : -1); } if (this.activeTime > 0) this.activeTime--;
    }
    draw(ctx) {
        if (this.activeTime > 0) {
            ctx.strokeStyle = 'white'; ctx.lineWidth = 4 * (this.activeTime / 10); ctx.lineCap = 'round';
            const w = this.range * this.owner.areaMult;
            ctx.beginPath(); ctx.moveTo(this.owner.x, this.owner.y);
            const cpX = this.owner.x + (this.direction === 1 ? w / 2 : -w / 2);
            const cpY = this.owner.y - 50;
            ctx.quadraticCurveTo(cpX, cpY, this.owner.x + (this.direction === 1 ? w : -w), this.owner.y);
            ctx.stroke();
            // Impact sparkles
            for (let i = 0; i < 3; i++) gameState.particles.push(new Particle(this.owner.x + (this.direction === 1 ? w : -w), this.owner.y, 'white', 2, Math.random() * Math.PI * 2, 10));
        }
    }
    getHitboxes() { if (this.activeTime <= 0) return []; const w = this.range * this.owner.areaMult; const h = this.height * this.owner.areaMult; return [{ x: this.owner.x + (this.direction === 1 ? w / 2 : -w / 2), y: this.owner.y, width: w, height: h, damage: this.damage * this.owner.damageMult, isRect: true }]; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class MineWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 120; this.timer = 0; this.radius = 40; this.damage = 30; this.count = 1; this.type = 'mine'; this.level = 1; this.maxLevel = 6; this.mines = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.mines.length - 1; i >= 0; i--) { const m = this.mines[i]; if (m.exploded) { m.life--; if (m.life <= 0) this.mines.splice(i, 1); } } }
    fire() { const total = this.count + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const angle = (i / Math.max(1, total)) * Math.PI * 2; const offsetDist = total > 1 ? 15 : 0; const offsetX = Math.cos(angle) * offsetDist; const offsetY = Math.sin(angle) * offsetDist; this.mines.push({ x: this.owner.x + offsetX, y: this.owner.y + offsetY, radius: 20, explodeRadius: this.radius * this.owner.areaMult, damage: this.damage * this.owner.damageMult, exploded: false, life: 30 }); } }
    draw(ctx) {
        this.mines.forEach(m => {
            if (!m.exploded) {
                ctx.fillStyle = '#34495e'; ctx.beginPath(); ctx.arc(m.x, m.y, 8 + Math.sin(gameTime * 10) * 2, 0, Math.PI * 2); ctx.fill();
            } else {
                const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.explodeRadius);
                grad.addColorStop(0, 'rgba(255,200,0,0.8)'); grad.addColorStop(0.3, '#e67e22'); grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(m.x, m.y, m.explodeRadius, 0, Math.PI * 2); ctx.fill();
            }
        });
    }
    getHitboxes() {
        const hits = [];
        this.mines.forEach(m => {
            if (!m.exploded) {
                gameState.enemies.forEach(e => {
                    if (Math.hypot(m.x - e.x, m.y - e.y) < m.radius + e.radius) { m.exploded = true; }
                });
            } else if (m.life === 30) { hits.push({ x: m.x, y: m.y, radius: m.explodeRadius, damage: m.damage }); }
        });
        return hits;
    }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class FireWandWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 100; this.timer = 0; this.projectileSpeed = 10; this.projectileSize = 10; this.damage = 25; this.count = 1; this.type = 'fire_wand'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < -20 || p.x > GAME_WIDTH + 20 || p.y < -20 || p.y > GAME_HEIGHT + 20) this.projectiles.splice(i, 1); } }
    fire() { const total = this.count + this.owner.projectileCountBonus; for (let i = 0; i < total; i++) { const angle = Math.random() * Math.PI * 2; this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: Math.cos(angle) * this.projectileSpeed * this.owner.projectileSpeedMult, dy: Math.sin(angle) * this.projectileSpeed * this.owner.projectileSpeedMult, radius: this.projectileSize, damage: this.damage * this.owner.damageMult }); } }
    draw(ctx) {
        this.projectiles.forEach(p => {
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
            grad.addColorStop(0, '#e67e22'); grad.addColorStop(0.5, '#f39c12'); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2); ctx.fill();
            // Flame particles
            if (Math.random() > 0.5) gameState.particles.push(new Particle(p.x, p.y, '#e67e22', 1, Math.random() * Math.PI * 2, 15));
        });
    }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

class SpearWeapon {
    constructor(owner) { this.owner = owner; this.cooldown = 80; this.timer = 0; this.projectileSpeed = 12; this.projectileSize = 4; this.damage = 20; this.count = 1; this.type = 'spear'; this.level = 1; this.maxLevel = 6; this.projectiles = []; }
    update() { this.timer++; const effective = this.cooldown / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult); if (this.timer >= effective) { this.timer = 0; this.fire(); } for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.x += p.dx; p.y += p.dy; if (p.x < -100 || p.x > GAME_WIDTH + 100 || p.y < -100 || p.y > GAME_HEIGHT + 100) this.projectiles.splice(i, 1); } }
    fire() {
        const total = this.count + this.owner.projectileCountBonus;
        let target = null; let minDist = Infinity;
        gameState.enemies.forEach(e => { const d = Math.hypot(e.x - this.owner.x, e.y - this.owner.y); if (d < minDist) { minDist = d; target = e; } });
        const baseAngle = target ? Math.atan2(target.y - this.owner.y, target.x - this.owner.x) : 0;
        const spreadAngle = Math.PI / 6; // 30度の広がり
        for (let i = 0; i < total; i++) {
            const offset = total > 1 ? (i - (total - 1) / 2) * (spreadAngle / Math.max(1, total - 1)) : 0;
            const angle = baseAngle + offset;
            this.projectiles.push({
                x: this.owner.x, y: this.owner.y,
                dx: Math.cos(angle) * this.projectileSpeed * this.owner.projectileSpeedMult,
                dy: Math.sin(angle) * this.projectileSpeed * this.owner.projectileSpeedMult,
                radius: this.projectileSize, damage: this.damage * this.owner.damageMult,
                trail: []
            });
        }
    }
    draw(ctx) {
        this.projectiles.forEach(p => {
            const angle = Math.atan2(p.dy, p.dx);
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle);
            ctx.fillStyle = 'rgba(236, 240, 241, 0.5)'; ctx.fillRect(-20, -2, 20, 4); // Tail
            ctx.fillStyle = 'white'; ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-10, -4); ctx.lineTo(-10, 4); ctx.closePath(); ctx.fill();
            ctx.restore();
            // Sparkles
            if (Math.random() > 0.7) gameState.particles.push(new Particle(p.x, p.y, '#f1c40f', 0.5, Math.random() * Math.PI * 2, 15));

            // Outer glow
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
            grad.addColorStop(0, 'rgba(241, 196, 15, 0.5)'); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2); ctx.fill();

            // Core
            ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        });
    }
    getHitboxes() { return this.projectiles; }
    upgrade(custom) { if (this.level >= this.maxLevel) return; this.level++; (custom || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades || []).forEach(u => applyUpgrade(this, u)); }
}

function createWeapon(type, owner) {
    switch (type) {
        case 'orbit': return new OrbitWeapon(owner); case 'wand': return new WandWeapon(owner); case 'aura': return new AuraWeapon(owner);
        case 'knife': return new KnifeWeapon(owner); case 'holy_water': return new HolyWaterWeapon(owner); case 'lightning': return new LightningWeapon(owner);
        case 'cross': return new CrossWeapon(owner); case 'axe': return new AxeWeapon(owner); case 'whip': return new WhipWeapon(owner);
        case 'fire_wand': return new FireWandWeapon(owner); case 'mine': return new MineWeapon(owner); case 'spear': return new SpearWeapon(owner);
        // Evolved weapons
        case 'celestial_orbit': return new CelestialOrbitWeapon(owner);
        case 'arcane_wand': return createEvolvedWeapon('wand', 'arcane_wand', owner, { damage: 2, projectileSpeed: 1.5, count: 3, expBoost: 0.15 });
        case 'divine_aura': return createEvolvedWeapon('aura', 'divine_aura', owner, { damage: 2, radius: 1.5, lifesteal: 0.03 });
        case 'deadly_blade': return createEvolvedWeapon('knife', 'deadly_blade', owner, { damage: 2, count: 3, cooldown: 0.5, critChance: 0.25, critDamage: 2.5 });
        case 'blessed_flood': return createEvolvedWeapon('holy_water', 'blessed_flood', owner, { damage: 2, radius: 1.5, duration: 2, defenseDown: 0.3 });
        case 'thunder_storm': return createEvolvedWeapon('lightning', 'thunder_storm', owner, { damage: 2.5, chainCount: 2, cooldown: 0.5, stunChance: 0.4, stunDuration: 90 });
        case 'holy_boomerang': return createEvolvedWeapon('cross', 'holy_boomerang', owner, { damage: 2, projectileSpeed: 1.5, projectileSize: 3, count: 2, knockback: 150 });
        case 'great_axe': return createEvolvedWeapon('axe', 'great_axe', owner, { damage: 2.5, radius: 1.3, count: 3, cooldown: 0.5, stunChance: 0.5, stunDuration: 60 });
        case 'dragon_whip': return createEvolvedWeapon('whip', 'dragon_whip', owner, { damage: 2, radius: 3, range: 3, lifesteal: 0.05 });
        case 'inferno': return createEvolvedWeapon('fire_wand', 'inferno', owner, { damage: 3, projectileSize: 2, count: 2, projectileSpeed: 3, burn: 10, burnDuration: 180 });
        case 'mine_field': return createEvolvedWeapon('mine', 'mine_field', owner, { damage: 2.5, count: 2, radius: 2, slow: 0.4 });
        case 'javelin': return createEvolvedWeapon('spear', 'javelin', owner, { damage: 2, projectileSpeed: 1.5, projectileSize: 2, count: 2, healOnHit: 2 });
        // TODO: Add other evolved weapons
    }
    return null;
}

// Helper function to create evolved weapons based on their base weapon
function createEvolvedWeapon(baseType, evolvedType, owner, multipliers) {
    const baseWeapon = createWeapon(baseType, owner);
    if (!baseWeapon) return null;
    
    // Apply multipliers to base weapon stats
    if (multipliers.damage) baseWeapon.damage = Math.floor(baseWeapon.damage * multipliers.damage);
    if (multipliers.projectileSpeed && baseWeapon.projectileSpeed) {
        baseWeapon.projectileSpeed *= multipliers.projectileSpeed;
    }
    if (multipliers.radius && baseWeapon.radius) {
        baseWeapon.radius = Math.floor(baseWeapon.radius * multipliers.radius);
    }
    if (multipliers.count && baseWeapon.count) {
        baseWeapon.count = Math.floor(baseWeapon.count * multipliers.count);
    }
    if (multipliers.chainCount && baseWeapon.chainCount) {
        baseWeapon.chainCount = Math.floor(baseWeapon.chainCount * multipliers.chainCount);
    }
    if (multipliers.projectileSize && baseWeapon.projectileSize) {
        baseWeapon.projectileSize = Math.floor(baseWeapon.projectileSize * multipliers.projectileSize);
    }
    if (multipliers.cooldown && baseWeapon.cooldown) {
        baseWeapon.cooldown = Math.floor(baseWeapon.cooldown * multipliers.cooldown);
    }
    if (multipliers.duration && baseWeapon.duration) {
        baseWeapon.duration = Math.floor(baseWeapon.duration * multipliers.duration);
    }
    if (multipliers.range && baseWeapon.range) {
        baseWeapon.range = Math.floor(baseWeapon.range * multipliers.range);
    }
    
    // Apply special effects based on weapon type
    if (multipliers.lifesteal) {
        baseWeapon.lifesteal = multipliers.lifesteal;
    }
    if (multipliers.slow) {
        baseWeapon.slow = multipliers.slow;
    }
    if (multipliers.expBoost) {
        baseWeapon.expBoost = multipliers.expBoost;
    }
    if (multipliers.critChance) {
        baseWeapon.critChance = multipliers.critChance;
        baseWeapon.critDamage = multipliers.critDamage || 2.0;
    }
    if (multipliers.defenseDown) {
        baseWeapon.defenseDown = multipliers.defenseDown;
    }
    if (multipliers.stunChance) {
        baseWeapon.stunChance = multipliers.stunChance;
        baseWeapon.stunDuration = multipliers.stunDuration || 60;
    }
    if (multipliers.knockback) {
        baseWeapon.knockback = multipliers.knockback;
    }
    if (multipliers.burn) {
        baseWeapon.burn = multipliers.burn;
        baseWeapon.burnDuration = multipliers.burnDuration || 180;
    }
    if (multipliers.healOnHit) {
        baseWeapon.healOnHit = multipliers.healOnHit;
    }
    
    // Update type and make it max level (no upgrades)
    baseWeapon.type = evolvedType;
    baseWeapon.level = 1;
    baseWeapon.maxLevel = 1;
    
    // Store original draw method
    const originalDraw = baseWeapon.draw.bind(baseWeapon);
    
    // Enhance draw method with evolved effects
    baseWeapon.draw = function(ctx) {
        // Add glow effect
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f1c40f';
        
        // Call original draw
        originalDraw(ctx);
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Add sparkle particles occasionally
        if (gameTime % 0.1 < 0.05) {
            const sparkleColors = ['#f1c40f', '#ffffff', '#e67e22'];
            const randomColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            
            // Add particles around weapon owner
            if (Math.random() > 0.7) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 30;
                const px = this.owner.x + Math.cos(angle) * distance;
                const py = this.owner.y + Math.sin(angle) * distance;
                gameState.particles.push(new Particle(px, py, randomColor, 1.5, Math.random() * Math.PI * 2, 25));
            }
            
            // Add particles to projectiles if they exist
            if (this.projectiles && this.projectiles.length > 0) {
                this.projectiles.forEach(proj => {
                    if (Math.random() > 0.85) {
                        gameState.particles.push(new Particle(proj.x, proj.y, randomColor, 1, Math.random() * Math.PI * 2, 20));
                    }
                });
            }
        }
    };
    
    // Store original getHitboxes if it needs to show larger/enhanced hitboxes
    const originalGetHitboxes = baseWeapon.getHitboxes.bind(baseWeapon);
    baseWeapon.getHitboxes = function() {
        const hitboxes = originalGetHitboxes();
        // Add golden glow effect to hitboxes visualization (damage is already multiplied)
        return hitboxes;
    };
    
    return baseWeapon;
}

class Player {
    constructor(weaponType, charKey) {
        const char = CHARACTERS[charKey] || CHARACTERS.knight;
        
        // Load permanent upgrades
        const permanentUpgrades = getPermanentUpgrades();
        
        this.x = GAME_WIDTH / 2; this.y = GAME_HEIGHT / 2; this.radius = 10;
        this.moveSpeed = char.moveSpeed; 
        
        // Apply permanent HP upgrade
        const baseHpBonus = PERMANENT_UPGRADES.baseHp.effect * permanentUpgrades.baseHp;
        this.hp = char.hp + baseHpBonus; 
        this.maxHp = char.hp + baseHpBonus;
        
        this.level = 1; this.exp = 0; this.nextLevelExp = 10;
        this.weapons = [createWeapon(weaponType, this)]; this.maxWeapons = 6;
        this.color = char.color; this.charType = charKey; this.skills = []; this.maxSkills = 6;
        
        // Apply permanent damage upgrade
        const baseDamageBonus = PERMANENT_UPGRADES.baseDamage.effect * permanentUpgrades.baseDamage;
        this.damageMult = char.attackDamage * (1 + baseDamageBonus);
        
        this.areaMult = 1.0; this.cooldownMult = 1.0;
        this.projectileCountBonus = 0; 
        
        // Apply permanent speed upgrade
        const baseSpeedBonus = PERMANENT_UPGRADES.baseSpeed.effect * permanentUpgrades.baseSpeed;
        this.moveSpeedMult = 1.0 + baseSpeedBonus;
        
        // Apply permanent exp gain upgrade
        const expGainBonus = PERMANENT_UPGRADES.expGain.effect * permanentUpgrades.expGain;
        this.expMult = 1.0 + expGainBonus;
        
        // Apply permanent pickup range upgrade
        const pickupRangeBonus = PERMANENT_UPGRADES.pickupRange.effect * permanentUpgrades.pickupRange;
        this.magnetRadius = char.magnetRadius * (1 + pickupRangeBonus);
        
        // Apply permanent armor upgrade
        const armorBonus = PERMANENT_UPGRADES.armor.effect * permanentUpgrades.armor;
        this.armor = char.armor + armorBonus;
        
        // Apply permanent attack speed upgrade
        const attackSpeedBonus = PERMANENT_UPGRADES.attackSpeed.effect * permanentUpgrades.attackSpeed;
        this.cooldownMult = 1.0 - attackSpeedBonus;
        
        // Apply permanent crit rate upgrade
        const critRateBonus = PERMANENT_UPGRADES.critRate.effect * permanentUpgrades.critRate;
        this.critRate = critRateBonus;
        
        this.regenAmount = 0; this.regenTimer = 0;
        this.projectileSpeedMult = char.projSpeed; this.durationMult = 1.0; 
        
        // Apply permanent reroll upgrade
        const rerollBonus = PERMANENT_UPGRADES.rerolls.effect * permanentUpgrades.rerolls;
        this.rerolls = char.rerolls + rerollBonus;
        
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
        this.weapons.forEach(w => { if (w) w.update(); });
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Body base
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        if (this.charType === 'knight') {
            // Helmet Visor
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-8, -4, 16, 6);
            ctx.fillStyle = '#f1c40f'; // Glow in visor
            ctx.fillRect(-4, -2, 8, 2);
            // Plume
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(8, -18); ctx.lineTo(-2, -14); ctx.fill();
        } else if (this.charType === 'rogue') {
            // Hood shadow
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath(); ctx.arc(0, 0, this.radius, Math.PI, 0); ctx.fill();
            // Sharp eyes
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-2, 0); ctx.lineTo(-6, 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(2, 0); ctx.lineTo(6, 2); ctx.fill();
        } else if (this.charType === 'mage') {
            // Pointy Hat
            ctx.fillStyle = '#8e44ad';
            ctx.beginPath();
            ctx.moveTo(-12, 0);
            ctx.lineTo(0, -22);
            ctx.lineTo(12, 0);
            ctx.fill();
            // Hat band
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(-10, -4, 20, 3);
            // Magic particles around mage
            if (gameTime % 0.5 < 0.1) {
                gameState.particles.push(new Particle(this.x + (Math.random() - 0.5) * 30, this.y + (Math.random() - 0.5) * 30, '#9b59b6', 1, Math.random() * Math.PI * 2, 20));
            }
        }

        ctx.restore();
        this.weapons.forEach(w => w.draw(ctx));
    }
    takeDamage(amt, am, onEnd) { const d = Math.max(1, amt - this.armor); this.hp -= d; am.playSFX('hurt'); if (this.hp <= 0) { this.hp = 0; onEnd(); } }
    hasWeapon(type) { return this.weapons.some(w => w.type === type); }
    addWeapon(type) {
        console.log('addWeapon called with type:', type);
        console.log('Current weapons count:', this.weapons.length);
        
        // Check if it's an evolved weapon
        const isEvolved = Object.values(WEAPON_EVOLUTIONS).some(evo => evo.evolved === type);
        console.log('Is evolved weapon:', isEvolved);
        
        const newWeapon = createWeapon(type, this);
        if (!newWeapon) {
            console.warn(`Weapon type "${type}" not implemented yet`);
            return;
        }
        
        console.log('Created weapon:', newWeapon.type);
        
        if (isEvolved) {
            // Evolved weapons can be added even if max weapons reached (replacing the base weapon)
            console.log('Adding evolved weapon to array');
            this.weapons.push(newWeapon);
            console.log('Weapons after push:', this.weapons.map(w => w ? w.type : 'null'));
        } else if (this.weapons.length < this.maxWeapons && !this.hasWeapon(type)) {
            this.weapons.push(newWeapon);
        }
    }
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
            case 'passive_amount': 
                this.projectileCountBonus += u.val; 
                console.log('複写の輪適用: +' + u.val + ', 合計: ' + this.projectileCountBonus);
                break;
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
const gameState = { player: null, enemies: [], expOrbs: [], projectiles: [], damageNumbers: [], particles: [], treasureChests: [], bossProjectiles: [], showDamageNumbers: true, isPaused: false, selectedCharacter: 'knight', selectedStage: 'forest', lastBossSpawnTime: 0, finalBossSpawned: false, bossCount: 0, totalCoins: 0 };
const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');
let gameTime = 0, lastTime = 0, nextSpawnTime = 0, loopRunning = false;
const keys = { w: false, s: false, a: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

window.addEventListener('keydown', e => { 
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    // ESC key to toggle pause
    if (e.key === 'Escape' && loopRunning && !document.getElementById('level-up-modal').classList.contains('hidden') === false) {
        togglePause();
    }
});
window.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

function updateUI() {
    if (!gameState.player) return;
    const timeLeft = Math.max(0, CLEAR_TIME - gameTime);
    document.getElementById('time').innerText = t('time') + formatTime(timeLeft);
    document.getElementById('level').innerText = t('level') + gameState.player.level;
    document.getElementById('hp-bar-fill').style.width = Math.max(0, (gameState.player.hp / gameState.player.maxHp) * 100) + '%';
    document.getElementById('hp-text').innerText = Math.floor(gameState.player.hp) + '/' + Math.floor(gameState.player.maxHp);
    document.getElementById('exp-bar-fill').style.width = Math.max(0, (gameState.player.exp / gameState.player.nextLevelExp) * 100) + '%';
    document.getElementById('exp-text').innerText = Math.floor(gameState.player.exp) + '/' + gameState.player.nextLevelExp;
    document.getElementById('coin-count').innerText = Math.floor(gameState.totalCoins);
}

function updateInventory() {
    const inv = document.getElementById('inventory'); if (!inv || !gameState.player) return; inv.innerHTML = '';
    console.log('Updating inventory, weapons:', gameState.player.weapons.map(w => w ? w.type : 'null'));
    const createRow = (items, prefix) => {
        const row = document.createElement('div'); row.className = 'inv-row';
        items.forEach(item => {
            if (!item) return; // Skip null items
            const container = document.createElement('div'); container.style.position = 'relative';
            const iconPath = prefix === 'skill_' ? getIconPath(item.type, true) : getWeaponIconPath(item.type);
            const img = document.createElement('img'); img.src = iconPath; img.className = 'inv-icon';
            
            // Check if it's an evolved weapon
            const isEvolved = prefix !== 'skill_' && Object.values(WEAPON_EVOLUTIONS).some(evo => evo.evolved === item.type);
            if (isEvolved) {
                img.style.background = 'linear-gradient(135deg, rgba(241, 196, 15, 0.3), rgba(243, 156, 18, 0.3))';
                img.style.borderColor = '#f1c40f';
                img.style.boxShadow = '0 0 10px rgba(241, 196, 15, 0.6)';
                img.style.border = '2px solid #f1c40f';
                // Add evolution star indicator
                const star = document.createElement('div');
                star.innerHTML = '⚡';
                star.style.cssText = 'position: absolute; top: -5px; right: -5px; font-size: 16px; text-shadow: 0 0 5px #f1c40f;';
                container.appendChild(star);
            }
            
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

    // Reroll info
    const rerollContainer = document.getElementById('reroll-container');
    if (rerollContainer) {
        rerollContainer.classList.remove('hidden');
        document.getElementById('reroll-count').innerText = p.rerolls;
        document.getElementById('reroll-btn').disabled = p.rerolls <= 0;
    }
    
    // Keep inventory visible during level up
    updateInventory();

    const options = [];
    const scale = (upgrades, rarity) => upgrades.map(u => ({ ...u, val: (['count', 'passive_amount', 'passive_armor'].includes(u.type) ? Math.ceil(u.val * rarity.mult) : u.val * rarity.mult) }));
    const getDesc = (upgrades) => upgrades.map(u => t(u.descKey) + ' (' + (['count', 'passive_amount', 'passive_armor'].includes(u.type) ? '+' + u.val : 'x' + (u.val > 0 ? (1 + u.val).toFixed(2) : (1 - u.val).toFixed(2))) + ')').join(', ');

    p.skills.forEach(s => { if (s.level < s.maxLevel) { const next = SKILL_UPGRADES[s.type].find(u => u.level === s.level + 1); if (next) { const r = getRandomRarity(false); const sc = scale(next.upgrades, r); options.push({ cat: 'label_skill', r, isNew: false, name: t('upgrade') + ' ' + t('skill_' + s.type) + ' (Lv ' + s.level + '->' + (s.level + 1) + '): ' + getDesc(sc), icon: getIconPath(s.type, true), action: () => { p.upgradeSkill(s.type, sc); onChoiceMade(); } }); } } });
    
    if (p.skills.length < p.maxSkills) {
        ALL_SKILL_TYPES.filter(type => !p.hasSkill(type)).forEach(type => {
            const r = getRandomRarity(false);
            // Check if this skill can evolve with any owned weapon
            let evolutionPartner = null;
            for (const [weaponType, evolution] of Object.entries(WEAPON_EVOLUTIONS)) {
                if (evolution.skill === type && p.hasWeapon(weaponType)) {
                    evolutionPartner = { type: weaponType, isWeapon: true };
                    break;
                }
            }
            options.push({
                cat: 'label_skill',
                r,
                isNew: true,
                name: t('skill_' + type) + ' (' + t('affects') + t(t('scope_' + type)) + '): ' + t('skill_' + type + '_desc'),
                icon: getIconPath(type, true),
                evolutionPartner: evolutionPartner,
                action: () => { p.addSkill(type); onChoiceMade(); }
            });
        });
    }
    
    p.weapons.forEach(w => { if (w.level < w.maxLevel) { const next = WEAPON_UPGRADES[w.type].find(u => u.level === w.level + 1); if (next) { const r = getRandomRarity(true); const sc = scale(next.upgrades, r); options.push({ cat: 'label_weapon', r, isNew: false, name: t('upgrade') + ' ' + t(w.type + '_weapon') + ' (Lv ' + w.level + '->' + (w.level + 1) + '): ' + getDesc(sc), icon: getIconPath(w.type, false), action: () => { w.upgrade(sc); onChoiceMade(); } }); } } });
    
    if (p.weapons.length < p.maxWeapons) {
        ALL_WEAPON_TYPES.filter(type => !p.hasWeapon(type)).forEach(type => {
            const r = getRandomRarity(true);
            // Check if this weapon can evolve with any owned skill
            let evolutionPartner = null;
            const evolution = WEAPON_EVOLUTIONS[type];
            if (evolution && p.hasSkill(evolution.skill)) {
                evolutionPartner = { type: evolution.skill, isWeapon: false };
            }
            options.push({
                cat: 'label_weapon',
                r,
                isNew: true,
                name: t(type + "_weapon"),
                icon: getIconPath(type, false),
                evolutionPartner: evolutionPartner,
                action: () => { p.addWeapon(type); onChoiceMade(); }
            });
        });
    }
    if (options.length === 0) options.push({ cat: 'label_skill', r: RARITIES.common, isNew: false, name: t("heal"), icon: "assets/heart.svg", action: () => { p.hp = Math.min(p.maxHp, p.hp + 50); onChoiceMade(); } });

    options.sort(() => 0.5 - Math.random()).slice(0, 3).forEach(opt => {
        const btn = document.createElement('div'); btn.className = 'level-up-option'; btn.style.borderColor = opt.isNew ? '#ffffff' : opt.r.color;
        const rarityText = opt.isNew ? '<span style="font-size:10px;font-weight:bold;color:#f1c40f;background:rgba(241,196,15,0.2);padding:2px 6px;border-radius:3px;">NEW</span>' : '<span style="font-size:10px;font-weight:bold;color:' + opt.r.color + '">' + t('rarity_' + opt.r.id) + '</span>';
        
        // Add evolution partner icon if available
        let evolutionHtml = '';
        if (opt.evolutionPartner) {
            const partnerIcon = opt.evolutionPartner.isWeapon ? getIconPath(opt.evolutionPartner.type, false) : getIconPath(opt.evolutionPartner.type, true);
            evolutionHtml = '<div style="margin-top:8px;display:flex;align-items:center;gap:6px;padding:4px 8px;background:rgba(241,196,15,0.15);border-radius:4px;border:1px solid rgba(241,196,15,0.3);">' +
                '<span style="font-size:10px;color:#f1c40f;">⚡進化可能:</span>' +
                '<img src="' + partnerIcon + '" style="width:20px;height:20px;border-radius:3px;border:1px solid rgba(241,196,15,0.5);">' +
                '<span style="font-size:10px;color:#f1c40f;">' + (opt.evolutionPartner.isWeapon ? t(opt.evolutionPartner.type + '_weapon') : t('skill_' + opt.evolutionPartner.type)) + '</span>' +
                '</div>';
        }
        
        btn.innerHTML = '<img src="' + opt.icon + '"><div style="flex-grow:1"><div style="display:flex; justify-content:space-between;"><span style="font-size:12px;color:#aaa;">' + t(opt.cat) + '</span>' + rarityText + '</div><div style="font-weight:bold;margin-top:2px;">' + opt.name + '</div>' + evolutionHtml + '</div>';
        btn.onclick = opt.action; choicesDiv.appendChild(btn);
    });
}

window.rerollChoices = () => {
    if (!gameState.player || gameState.player.rerolls <= 0) return;
    gameState.player.rerolls--;
    showLevelUpMenu();
};


function onChoiceMade() { document.getElementById('level-up-modal').classList.add('hidden'); gameState.isPaused = false; lastTime = performance.now(); updateInventory(); }

function spawnEnemy() { 
    const min = Math.min(9, Math.floor(gameTime / 30)); 
    // Spawn 1.2x enemies (20% more)
    gameState.enemies.push(new Enemy(ENEMY_TYPES[min])); 
    if (Math.random() < 0.2) {
        gameState.enemies.push(new Enemy(ENEMY_TYPES[min]));
    }
}

function spawnBoss(isFinal = false) {
    let bossType;
    if (isFinal) {
        bossType = BOSS_TYPES.final_boss;
    } else {
        gameState.bossCount++;
        const bossKey = 'minute_boss_' + Math.min(gameState.bossCount, 4);
        bossType = BOSS_TYPES[bossKey];
    }
    const mult = (gameState.selectedStage ? STAGES[gameState.selectedStage].mult : 1.0);
    const boss = new Enemy(bossType);
    boss.hp = bossType.hp * mult;
    boss.damage = bossType.damage * mult;
    boss.isBoss = true;
    boss.isFinalBoss = isFinal;
    boss.glowIntensity = bossType.glowIntensity || 0.5;
    boss.pulseEffect = bossType.pulseEffect || false;
    gameState.enemies.push(boss);
    if (!isFinal) {
        gameState.lastBossSpawnTime = Math.floor(gameTime / 60) * 60;
    }
}

function checkCollisions() {
    const p = gameState.player; if (!p) return;
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const e = gameState.enemies[i]; if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) p.takeDamage(e.damage, audioManager, endGame);
        p.weapons.forEach(w => w.getHitboxes().forEach(h => {
            let hit = false;
            if (h.isRect) {
                if (e.x + e.radius > h.x - h.width / 2 && e.x - e.radius < h.x + h.width / 2 && e.y + e.radius > h.y - h.height / 2 && e.y - e.radius < h.y + h.height / 2) hit = true;
            } else {
                if (Math.hypot(h.x - e.x, h.y - e.y) < h.radius + e.radius) hit = true;
            }
            if (hit) {
                let d = h.damage || w.damage * p.damageMult;
                
                // Apply defense down multiplier if enemy has defense down debuff
                if (e.defenseDown) {
                    d *= (1 + e.defenseDown);
                }
                
                // Apply critical hit if weapon has crit chance or player has base crit rate
                const totalCritChance = (w.critChance || 0) + (p.critRate || 0);
                if (totalCritChance > 0 && Math.random() < totalCritChance) {
                    d *= w.critDamage || 2.0;
                    if (gameState.showDamageNumbers) {
                        gameState.damageNumbers.push(new DamageNumber(e.x, e.y, d, false, true));
                    }
                } else {
                    if (gameState.showDamageNumbers) gameState.damageNumbers.push(new DamageNumber(e.x, e.y, d));
                }
                
                e.hp -= d;
                
                // Apply special effects
                if (w.slow && !e.slowed) {
                    e.baseSpeed = e.baseSpeed || e.speed;
                    e.speed = e.baseSpeed * (1 - w.slow);
                    e.slowed = true;
                    e.slowTimer = 180;
                }
                
                if (w.defenseDown && !e.defenseDown) {
                    e.defenseDown = w.defenseDown;
                    e.defenseDownTimer = 300;
                }
                
                if (w.stunChance && Math.random() < w.stunChance) {
                    e.stunned = true;
                    e.stunnedTimer = w.stunDuration;
                }
                
                if (w.knockback) {
                    const angle = Math.atan2(e.y - h.y, e.x - h.x);
                    e.knockbackX = Math.cos(angle) * w.knockback;
                    e.knockbackY = Math.sin(angle) * w.knockback;
                    e.knockbackTimer = 10;
                }
                
                if (w.burn && !e.burning) {
                    e.burning = true;
                    e.burnDamage = w.burn;
                    e.burnTimer = w.burnDuration;
                    e.burnTickTimer = 0;
                }
                
                if (w.healOnHit) {
                    p.hp = Math.min(p.hp + w.healOnHit, p.maxHp);
                    if (gameState.showDamageNumbers) {
                        gameState.damageNumbers.push(new DamageNumber(p.x, p.y - 20, w.healOnHit, true));
                    }
                }
                
                // Hit particles
                for (let j = 0; j < 5; j++) gameState.particles.push(new Particle(e.x, e.y, e.color, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 20));
            }
        }));
        if (e.hp <= 0) {
            audioManager.playSFX('hit');
            
            // Check for lifesteal effect
            p.weapons.forEach(w => {
                if (w.lifesteal) {
                    const healAmount = Math.ceil(p.maxHp * w.lifesteal);
                    p.hp = Math.min(p.hp + healAmount, p.maxHp);
                    // Show heal number
                    if (gameState.showDamageNumbers) {
                        gameState.damageNumbers.push(new DamageNumber(p.x, p.y - 20, healAmount, true));
                    }
                    // Heal particles
                    for (let j = 0; j < 5; j++) {
                        gameState.particles.push(new Particle(p.x, p.y, '#2ecc71', Math.random() * 2 + 1, Math.random() * Math.PI * 2, 20));
                    }
                }
            });
            
            // Check for exp boost effect
            p.weapons.forEach(w => {
                if (w.expBoost) {
                    e.exp = Math.ceil(e.exp * (1 + w.expBoost));
                }
            });
            
            if (e.isFinalBoss) {
                // Final boss defeated - clear game
                endGame(true);
                return;
            } else if (e.isBoss) {
                // Regular boss - drop treasure chest
                const rewardCount = calculateTreasureRewards();
                if (rewardCount > 0) {
                    gameState.treasureChests.push(new TreasureChest(e.x, e.y, rewardCount));
                    // Spawn particles
                    for (let j = 0; j < 20; j++) {
                        const color = rewardCount === 5 ? '#f1c40f' : rewardCount === 3 ? '#3498db' : '#95a5a6';
                        gameState.particles.push(new Particle(e.x, e.y, color, Math.random() * 3 + 2, Math.random() * Math.PI * 2, 30));
                    }
                }
            }
            
            // Automatically add coins based on enemy exp value (5% base + upgrades)
            const permanentUpgrades = getPermanentUpgrades();
            const coinDropRateBonus = PERMANENT_UPGRADES.coinDropRate.effect * permanentUpgrades.coinDropRate;
            const totalDropRate = 0.05 + coinDropRateBonus;
            if (Math.random() < totalDropRate) {
                const coinBonus = PERMANENT_UPGRADES.coinBonus.effect * permanentUpgrades.coinBonus;
                const baseCoinValue = Math.max(1, Math.floor(e.exp / 5));
                const coinValue = Math.floor(baseCoinValue * (1 + coinBonus));
                gameState.totalCoins += coinValue;
                const savedCoins = parseInt(localStorage.getItem('total_coins') || '0');
                localStorage.setItem('total_coins', (savedCoins + coinValue).toString());
                // Visual feedback for coin gain
                gameState.damageNumbers.push(new DamageNumber(e.x, e.y - 20, '+' + coinValue + '💰', true));
            }
            
            gameState.expOrbs.push(new ExpOrb(e.x, e.y, e.exp));
            gameState.enemies.splice(i, 1);
        }
    }
    for (let i = gameState.expOrbs.length - 1; i >= 0; i--) {
        const o = gameState.expOrbs[i]; if (Math.hypot(p.x - o.x, p.y - o.y) < p.magnetRadius) { p.exp += o.value * p.expMult; audioManager.playSFX('pickup'); if (p.exp >= p.nextLevelExp) { p.level++; p.exp -= p.nextLevelExp; p.nextLevelExp = Math.floor(p.nextLevelExp * 1.2); showLevelUpMenu(); } gameState.expOrbs.splice(i, 1); }
    }
    
    // Treasure chest collection
    for (let i = gameState.treasureChests.length - 1; i >= 0; i--) {
        const chest = gameState.treasureChests[i];
        if (!chest.collected && Math.hypot(p.x - chest.x, p.y - chest.y) < p.magnetRadius) {
            chest.collected = true;
            // Collect immediately
            collectTreasure(chest);
            // Remove chest after collection
            gameState.treasureChests.splice(i, 1);
        }
    }
    
    // Boss projectile collision with player
    for (let i = gameState.bossProjectiles.length - 1; i >= 0; i--) {
        const proj = gameState.bossProjectiles[i];
        if (Math.hypot(p.x - proj.x, p.y - proj.y) < p.radius + proj.radius) {
            p.takeDamage(proj.damage, audioManager, endGame);
            // Explosion particles
            for (let j = 0; j < 10; j++) {
                gameState.particles.push(new Particle(proj.x, proj.y, '#8B0000', Math.random() * 3 + 1, Math.random() * Math.PI * 2, 20));
            }
            gameState.bossProjectiles.splice(i, 1);
        }
    }
}

function createScreenFlash(color) {
    const canvas = document.getElementById('game-canvas');
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${color};
        opacity: 0.6;
        pointer-events: none;
        z-index: 50;
        animation: flashFade 0.5s ease-out forwards;
    `;
    canvas.parentElement.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
}

function animateChestOpen(chest) {
    // Create burst of particles
    const burstCount = chest.rewardCount === 5 ? 60 : chest.rewardCount === 3 ? 40 : 20;
    for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount;
        const speed = 3 + Math.random() * 4;
        gameState.particles.push(
            new Particle(chest.x, chest.y, chest.color, speed, angle, 40)
        );
    }
    // Upward particles
    for (let i = 0; i < 30; i++) {
        gameState.particles.push(
            new Particle(
                chest.x + (Math.random() - 0.5) * 20,
                chest.y,
                chest.color,
                2 + Math.random() * 3,
                -Math.PI / 2 + (Math.random() - 0.5) * 0.5,
                60
            )
        );
    }
    audioManager.playSFX('pickup');
}

function calculateTreasureRewards() {
    // Completely random: 1, 3, or 5 rewards
    const rand = Math.random();
    if (rand < 0.5) return 1;      // 50% chance
    if (rand < 0.85) return 3;     // 35% chance
    return 5;                       // 15% chance
}

function getUpgradeDescription(upgrades) {
    const descriptions = upgrades.map(u => {
        switch (u.type) {
            case 'passive_damage':
                return `攻撃力 +${Math.round(u.val * 100)}%`;
            case 'passive_speed':
                return `攻撃速度 +${Math.round(u.val * 100)}%`;
            case 'passive_area':
                return `範囲 +${Math.round(u.val * 100)}%`;
            case 'passive_proj_speed':
                return `弾速 +${Math.round(u.val * 100)}%`;
            case 'passive_duration':
                return `持続時間 +${Math.round(u.val * 100)}%`;
            case 'count':
                return `数量 +${u.val}`;
            case 'passive_amount':
                return `数量 +${u.val}`;
            case 'passive_hp':
                return `最大HP +${Math.round(u.val * 100)}%`;
            case 'passive_magnet':
                return `回収範囲 +${Math.round(u.val * 100)}%`;
            case 'passive_move_speed':
                return `移動速度 +${Math.round(u.val * 100)}%`;
            case 'passive_exp':
                return `経験値 +${Math.round(u.val * 100)}%`;
            case 'passive_armor':
                return `防御力 +${u.val}`;
            case 'passive_regen':
                return `HP回復 +${u.val}/秒`;
            default:
                return '';
        }
    });
    return descriptions.filter(d => d).join(', ');
}

function checkWeaponEvolutions(player) {
    const evolutions = [];
    player.weapons.forEach(weapon => {
        if (weapon.level >= 6) { // Max level
            const evolution = WEAPON_EVOLUTIONS[weapon.type];
            if (evolution) {
                const skill = player.skills.find(s => 
                    s.type === evolution.skill
                );
                if (skill) {
                    evolutions.push({
                        weaponType: weapon.type,
                        evolvedType: evolution.evolved,
                        evolvedName: evolution.name,
                        weapon: weapon,
                        skill: skill
                    });
                }
            }
        }
    });
    return evolutions;
}

function collectTreasure(chest) {
    const p = gameState.player;
    const rewardCount = chest.rewardCount;
    
    // Pause game before showing rewards
    gameState.isPaused = true;
    
    // Check for weapon evolutions first
    const possibleEvolutions = checkWeaponEvolutions(p);
    
    // Collect eligible items for upgrade
    const eligibleItems = [];
    p.weapons.forEach(w => {
        if (w.level < w.maxLevel) eligibleItems.push({ type: 'weapon', item: w });
    });
    p.skills.forEach(s => {
        if (s.level < s.maxLevel) eligibleItems.push({ type: 'skill', item: s });
    });
    
    // Store rewards for display
    const rewards = [];
    
    // Add evolutions as rewards (if any)
    possibleEvolutions.forEach(evo => {
        rewards.push({
            type: 'evolution',
            name: evo.evolvedName,
            level: 'EVOLUTION!',
            upgradeDesc: `${t(evo.weaponType + '_weapon')} + ${t('skill_' + evo.skill.type)} の融合`,
            icon: getIconPath(evo.weaponType, false),
            evolution: evo
        });
    });
    
    // Upgrade items (up to available count)
    const upgradeCount = Math.min(rewardCount, eligibleItems.length);
    for (let i = 0; i < upgradeCount; i++) {
        const idx = Math.floor(Math.random() * eligibleItems.length);
        const selected = eligibleItems[idx];
        
        if (selected.type === 'weapon') {
            const oldLevel = selected.item.level;
            const upgrades = WEAPON_UPGRADES[selected.item.type];
            const nextUpgrade = upgrades ? upgrades.find(u => u.level === selected.item.level + 1) : null;
            let upgradeDesc = '';
            if (nextUpgrade) {
                upgradeDesc = getUpgradeDescription(nextUpgrade.upgrades);
                selected.item.upgrade(nextUpgrade.upgrades);
            } else {
                selected.item.level++;
            }
            rewards.push({
                type: 'weapon',
                name: t(selected.item.type + '_weapon'),
                level: oldLevel + ' → ' + selected.item.level,
                upgradeDesc: upgradeDesc,
                icon: getIconPath(selected.item.type, false)
            });
        } else {
            const oldLevel = selected.item.level;
            const skillUpgrades = SKILL_UPGRADES[selected.item.type];
            const nextUpgrade = skillUpgrades ? skillUpgrades.find(u => u.level === selected.item.level + 1) : null;
            let upgradeDesc = '';
            if (nextUpgrade) {
                upgradeDesc = getUpgradeDescription(nextUpgrade.upgrades);
            }
            p.upgradeSkill(selected.item.type);
            rewards.push({
                type: 'skill',
                name: t('skill_' + selected.item.type),
                level: oldLevel + ' → ' + selected.item.level,
                upgradeDesc: upgradeDesc,
                icon: getIconPath(selected.item.type, true)
            });
        }
        
        eligibleItems.splice(idx, 1);
    }
    
    // Remaining rewards become HP healing
    const remainingRewards = rewardCount - upgradeCount;
    if (remainingRewards > 0) {
        const healAmount = Math.floor(p.maxHp * 0.1 * remainingRewards);
        p.hp = Math.min(p.maxHp, p.hp + healAmount);
        rewards.push({
            type: 'heal',
            name: 'HP回復',
            level: '+' + healAmount + ' HP (×' + remainingRewards + ')',
            icon: 'assets/heart.svg'
        });
    }
    
    updateInventory();
    
    // Show reward modal immediately
    showTreasureRewards(rewards);
}

function playTreasureEffect(x, y, rewardCount) {
    const color = rewardCount === 5 ? '#f1c40f' : rewardCount === 3 ? '#3498db' : '#95a5a6';
    const particleCount = rewardCount === 5 ? 100 : rewardCount === 3 ? 60 : 30;
    const speed = rewardCount === 5 ? 8 : rewardCount === 3 ? 6 : 4;
    
    // Main particle burst
    for (let i = 0; i < particleCount; i++) {
        gameState.particles.push(
            new Particle(x, y, color, Math.random() * speed + 2, Math.random() * Math.PI * 2, 80)
        );
    }
    
    // Multiple rings for all treasure types
    const ringCount = rewardCount === 5 ? 3 : rewardCount === 3 ? 2 : 1;
    for (let ring = 0; ring < ringCount; ring++) {
        const ringSize = 30 + ring * 10;
        for (let i = 0; i < ringSize; i++) {
            const angle = (i / ringSize) * Math.PI * 2;
            gameState.particles.push(
                new Particle(x, y, ring === 0 ? '#ffffff' : color, 5 + ring, angle, 50 + ring * 10)
            );
        }
    }
    
    // Extra star burst for legendary
    if (rewardCount === 5) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            for (let j = 0; j < 5; j++) {
                gameState.particles.push(
                    new Particle(x, y, '#ffffff', 3 + j, angle + (Math.random() - 0.5) * 0.3, 60)
                );
            }
        }
    }
    
    audioManager.playSFX('levelup');
}

function showTreasureRewards(rewards) {
    const modal = document.getElementById('level-up-modal');
    const choicesDiv = document.getElementById('choices');
    
    choicesDiv.innerHTML = '';
    modal.classList.remove('hidden');
    
    // Hide reroll button
    const rerollContainer = document.getElementById('reroll-container');
    if (rerollContainer) rerollContainer.classList.add('hidden');
    
    // Add title
    const h2 = modal.querySelector('h2');
    if (h2) h2.textContent = `宝箱の報酬 (${rewards.length}個獲得！)`;
    
    // Display each reward as a level-up option style
    rewards.forEach((reward, index) => {
        const btn = document.createElement('div');
        btn.className = 'level-up-option';
        
        // Type-based border colors
        let borderColor = '#f1c40f';
        let categoryText = 'REWARD';
        if (reward.type === 'evolution') {
            borderColor = '#f1c40f';
            categoryText = '⚡ EVOLUTION';
            btn.style.background = 'linear-gradient(135deg, rgba(241, 196, 15, 0.2), rgba(243, 156, 18, 0.2))';
            btn.style.boxShadow = '0 0 20px rgba(241, 196, 15, 0.5)';
        } else if (reward.type === 'weapon') {
            borderColor = '#e74c3c';
            categoryText = 'WEAPON';
        } else if (reward.type === 'skill') {
            borderColor = '#3498db';
            categoryText = 'SKILL';
        } else if (reward.type === 'heal') {
            borderColor = '#2ecc71';
            categoryText = 'HEAL';
        }
        
        btn.style.borderColor = borderColor;
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        btn.style.animation = `rewardSlideIn 0.5s ease-out ${index * 0.15}s forwards`;
        btn.style.pointerEvents = 'none';
        
        // Build description text
        let descriptionHtml = '';
        if (reward.upgradeDesc) {
            descriptionHtml = `<div style="font-size:11px;color:#95a5a6;margin-top:4px;">${reward.upgradeDesc}</div>`;
        }
        
        btn.innerHTML = `
            <img src="${reward.icon}">
            <div style="flex-grow:1">
                <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:12px;color:#aaa;">${categoryText}</span>
                    <span style="font-size:12px;font-weight:bold;color:${borderColor}">${reward.level}</span>
                </div>
                <div style="font-weight:bold;margin-top:2px;font-size:16px;">${reward.name}</div>
                ${descriptionHtml}
            </div>
        `;
        
        choicesDiv.appendChild(btn);
    });
    
    // Add continue button
    const continueBtn = document.createElement('div');
    continueBtn.className = 'level-up-option';
    continueBtn.style.cssText = 'background: #f1c40f; color: #000; border: 2px solid #f39c12; cursor: pointer; margin-top: 20px; justify-content: center;';
    continueBtn.innerHTML = '<div style="font-weight:bold; font-size:18px;">✓ 確認</div>';
    continueBtn.addEventListener('click', function() {
        console.log('Treasure reward confirmed, resuming game...');
        closeTreasureReward(rewards);
    });
    choicesDiv.appendChild(continueBtn);
}

window.closeTreasureReward = (rewards) => {
    console.log('closeTreasureReward called, isPaused:', gameState.isPaused);
    
    // Execute evolutions
    if (rewards) {
        rewards.forEach(reward => {
            if (reward.type === 'evolution' && reward.evolution) {
                evolveWeapon(gameState.player, reward.evolution);
            }
        });
    }
    
    const modal = document.getElementById('level-up-modal');
    modal.classList.add('hidden');
    
    // Reset title
    const h2 = modal.querySelector('h2');
    if (h2) h2.textContent = 'Level Up!';
    
    // Show reroll button again
    const rerollContainer = document.getElementById('reroll-container');
    if (rerollContainer) rerollContainer.classList.remove('hidden');
    
    // Resume game - ensure lastTime is updated to prevent time jump
    lastTime = performance.now();
    gameState.isPaused = false;
    
    console.log('Game resumed, isPaused:', gameState.isPaused);
    
    updateInventory();
};

function evolveWeapon(player, evolution) {
    console.log('=== Evolution Start ===');
    console.log('Weapons before:', player.weapons.map(w => w ? w.type : 'null'));
    console.log('Evolving weapon:', evolution.weaponType, 'to', evolution.evolvedType);
    
    // Find and remove old weapon
    const weaponIndex = player.weapons.findIndex(w => w && w.type === evolution.weaponType);
    console.log('Found weapon at index:', weaponIndex);
    
    if (weaponIndex !== -1) {
        player.weapons.splice(weaponIndex, 1);
        console.log('Removed weapon, weapons after removal:', player.weapons.map(w => w ? w.type : 'null'));
    }
    
    // Add evolved weapon
    console.log('Adding evolved weapon:', evolution.evolvedType);
    player.addWeapon(evolution.evolvedType);
    console.log('Weapons after adding evolved:', player.weapons.map(w => w ? w.type : 'null'));
    console.log('=== Evolution End ===');
    
    // Play evolution effect
    audioManager.playSFX('levelup');
}


function endGame(isCleared = false) {
    loopRunning = false;
    
    if (isCleared) {
        audioManager.playSFX('levelup');
        document.getElementById('game-clear-modal').classList.remove('hidden');
        document.getElementById('clear-final-time').innerText = formatTime(gameTime);
        
        // Mark stage as cleared
        const stage = gameState.selectedStage;
        localStorage.setItem('stage_cleared_' + stage, 'true');
    } else {
        audioManager.playSFX('gameover');
        document.getElementById('game-over-modal').classList.remove('hidden');
        document.getElementById('final-time').innerText = formatTime(gameTime);
    }

    // Save best time
    const stage = gameState.selectedStage;
    const currentBest = parseFloat(localStorage.getItem('best_time_' + stage) || 0);
    if (gameTime > currentBest) {
        localStorage.setItem('best_time_' + stage, gameTime);
    }
}

function loop(timestamp) {
    if (!loopRunning) return; if (gameState.isPaused) { lastTime = timestamp; requestAnimationFrame(loop); return; }
    const dt = (timestamp - lastTime) / 1000; lastTime = timestamp; gameTime += dt;
    
    // Boss spawning logic
    const currentMinute = Math.floor(gameTime / 60);
    const lastSpawnMinute = Math.floor(gameState.lastBossSpawnTime / 60);
    if (currentMinute > lastSpawnMinute && currentMinute > 0 && gameTime < CLEAR_TIME) {
        spawnBoss(false);
    }
    
    // Final boss spawn at clear time
    if (gameTime >= CLEAR_TIME && !gameState.finalBossSpawned) {
        gameState.finalBossSpawned = true;
        spawnBoss(true);
        // Stop normal enemy spawning
        nextSpawnTime = Infinity;
    }
    
    if (gameTime > nextSpawnTime && gameTime < CLEAR_TIME) { spawnEnemy(); nextSpawnTime = gameTime + Math.max(0.2, 2.0 - (gameTime / 60)); }
    ctx.fillStyle = STAGES[gameState.selectedStage].bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); const p = gameState.player; p.update(keys); p.draw(ctx);
    gameState.enemies.forEach(e => { e.update(p); e.draw(ctx); });
    gameState.expOrbs.forEach(o => o.draw(ctx));
    gameState.treasureChests.forEach(chest => chest.draw(ctx));
    
    // Update and draw boss projectiles
    for (let i = gameState.bossProjectiles.length - 1; i >= 0; i--) {
        const proj = gameState.bossProjectiles[i];
        proj.update();
        proj.draw(ctx);
        if (proj.isOffScreen()) {
            gameState.bossProjectiles.splice(i, 1);
        }
    }
    
    gameState.particles.forEach((p, i) => { p.update(); p.draw(ctx); if (p.life <= 0) gameState.particles.splice(i, 1); });
    gameState.damageNumbers.forEach((d, i) => { d.update(); d.draw(ctx); if (d.life <= 0) gameState.damageNumbers.splice(i, 1); });
    checkCollisions(); updateUI(); requestAnimationFrame(loop);
}

// --- GLOBAL ATTACHMENTS ---
window.togglePause = () => {
    if (!loopRunning) return;
    
    // Don't pause if level up modal is open
    if (!document.getElementById('level-up-modal').classList.contains('hidden')) return;
    
    const pauseModal = document.getElementById('pause-modal');
    if (gameState.isPaused) {
        // Resume game
        resumeGame();
    } else {
        // Pause game
        gameState.isPaused = true;
        pauseModal.classList.remove('hidden');
        audioManager.playSFX('click');
    }
};

window.resumeGame = () => {
    gameState.isPaused = false;
    document.getElementById('pause-modal').classList.add('hidden');
    lastTime = performance.now();
    audioManager.playSFX('click');
};

window.returnToTitle = () => {
    loopRunning = false;
    gameState.isPaused = false;
    document.getElementById('pause-modal').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
    audioManager.playSFX('click');
    location.reload();
};

window.backToTitle = () => {
    document.getElementById('stage-select-screen').classList.add('hidden');
    document.getElementById('character-select-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
    audioManager.playSFX('click');
};
window.backToStageSelect = () => {
    document.getElementById('character-select-screen').classList.add('hidden');
    document.getElementById('stage-select-screen').classList.remove('hidden');
    audioManager.playSFX('click');
};
window.backToCharacterSelect = () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('character-select-screen').classList.remove('hidden');
    audioManager.playSFX('click');
};
window.goToStageSelect = () => {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('stage-select-screen').classList.remove('hidden');
    audioManager.init();

    // Check stage unlock status
    const forestCleared = localStorage.getItem('stage_cleared_forest') === 'true';
    const libraryCleared = localStorage.getItem('stage_cleared_library') === 'true';
    
    // Update best times and lock/unlock stages
    ['forest', 'library', 'hell'].forEach(stage => {
        const best = localStorage.getItem('best_time_' + stage);
        const el = document.getElementById('best-time-' + stage);
        if (el) {
            el.innerText = 'Best: ' + (best ? formatTime(parseFloat(best)) : '--:--');
        }
        
        const card = document.querySelector(`.stage-card.${stage === 'forest' ? 'easy' : stage === 'library' ? 'normal' : 'hard'}`);
        if (card) {
            // Forest is always unlocked
            if (stage === 'forest') {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
                card.style.filter = 'none';
            } 
            // Library requires forest clear
            else if (stage === 'library') {
                if (forestCleared) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'none';
                } else {
                    card.style.opacity = '0.5';
                    card.style.pointerEvents = 'none';
                    card.style.filter = 'grayscale(1)';
                    if (!card.querySelector('.locked-text')) {
                        const lockedText = document.createElement('div');
                        lockedText.className = 'locked-text';
                        lockedText.textContent = '🔒 神秘の森をクリアしてください';
                        lockedText.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 8px; font-weight: bold;';
                        card.appendChild(lockedText);
                    }
                }
            }
            // Hell requires library clear
            else if (stage === 'hell') {
                if (libraryCleared) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    card.style.filter = 'none';
                } else {
                    card.style.opacity = '0.5';
                    card.style.pointerEvents = 'none';
                    card.style.filter = 'grayscale(1)';
                    if (!card.querySelector('.locked-text')) {
                        const lockedText = document.createElement('div');
                        lockedText.className = 'locked-text';
                        lockedText.textContent = '🔒 失われた図書館をクリアしてください';
                        lockedText.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 8px; font-weight: bold;';
                        card.appendChild(lockedText);
                    }
                }
            }
        }
    });
};
window.selectStage = (stage) => {
    // Check if stage is unlocked
    if (stage === 'library') {
        const forestCleared = localStorage.getItem('stage_cleared_forest') === 'true';
        if (!forestCleared) {
            audioManager.playSFX('hurt');
            return;
        }
    } else if (stage === 'hell') {
        const libraryCleared = localStorage.getItem('stage_cleared_library') === 'true';
        if (!libraryCleared) {
            audioManager.playSFX('hurt');
            return;
        }
    }
    
    gameState.selectedStage = stage;
    document.getElementById('stage-select-screen').classList.add('hidden');
    document.getElementById('character-select-screen').classList.remove('hidden');
};
window.goToCharacterSelect = () => { document.getElementById('title-screen').classList.add('hidden'); document.getElementById('character-select-screen').classList.remove('hidden'); audioManager.init(); };
window.selectCharacter = (char) => { gameState.selectedCharacter = char; document.getElementById('character-select-screen').classList.add('hidden'); document.getElementById('start-screen').classList.remove('hidden'); audioManager.startBGM(); };
window.startGame = (type) => { 
    document.getElementById('start-screen').classList.add('hidden'); 
    gameState.player = new Player(type, gameState.selectedCharacter); 
    gameState.enemies = []; 
    gameState.expOrbs = []; 
    gameState.treasureChests = []; 
    gameState.damageNumbers = []; 
    gameState.particles = []; 
    gameState.bossProjectiles = []; 
    gameState.lastBossSpawnTime = 0; 
    gameState.finalBossSpawned = false; 
    gameState.bossCount = 0; 
    // Load coins from localStorage
    gameState.totalCoins = parseInt(localStorage.getItem('total_coins') || '0');
    gameTime = 0; 
    nextSpawnTime = 1; 
    lastTime = performance.now(); 
    loopRunning = true; 
    updateInventory(); 
    requestAnimationFrame(loop); 
};
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
            <img src="${getIconPath(type, false)}" class="lib-icon">
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
            <img src="${getIconPath(type, true)}" class="lib-icon">
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

window.toggleEvolutionGuide = () => {
    const screen = document.getElementById('evolution-guide-screen');
    const titleScreen = document.getElementById('title-screen');
    
    if (screen.classList.contains('hidden')) {
        // Show evolution guide
        updateEvolutionGuide();
        titleScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    } else {
        // Hide evolution guide
        screen.classList.add('hidden');
        titleScreen.classList.remove('hidden');
    }
};

function updateEvolutionGuide() {
    const evolutionList = document.getElementById('evolution-list');
    if (!evolutionList) return;
    
    evolutionList.innerHTML = '';
    
    // Create evolution cards for each weapon
    Object.entries(WEAPON_EVOLUTIONS).forEach(([weaponType, evolution]) => {
        const card = document.createElement('div');
        card.className = 'evolution-card';
        
        const weaponName = t(weaponType + '_weapon') || weaponType;
        const skillName = t('skill_' + evolution.skill) || evolution.skill;
        
        card.innerHTML = `
            <div class="evolution-card-header">
                <img src="${getIconPath(weaponType, false)}" class="evolution-icon">
                <div class="evolution-plus">+</div>
                <img src="${getIconPath(evolution.skill, true)}" class="evolution-icon">
                <div class="evolution-arrow">→</div>
                <div class="evolution-result">
                    <img src="${getIconPath(weaponType, false)}" class="evolution-icon evolved">
                    <div class="evolution-star">⚡</div>
                </div>
            </div>
            <div class="evolution-card-body">
                <div class="evolution-name">${evolution.name}</div>
            </div>
        `;
        
        evolutionList.appendChild(card);
    });
}

// --- PERMANENT UPGRADES SYSTEM ---
const PERMANENT_UPGRADES = {
    baseHp: { maxLevel: 10, baseCost: 100, costMultiplier: 1.5, effect: 10 },
    baseDamage: { maxLevel: 10, baseCost: 150, costMultiplier: 1.5, effect: 0.05 },
    baseSpeed: { maxLevel: 10, baseCost: 120, costMultiplier: 1.5, effect: 0.05 },
    rerolls: { maxLevel: 5, baseCost: 200, costMultiplier: 2, effect: 1 },
    expGain: { maxLevel: 10, baseCost: 180, costMultiplier: 1.5, effect: 0.1 },
    pickupRange: { maxLevel: 10, baseCost: 140, costMultiplier: 1.5, effect: 0.1 },
    armor: { maxLevel: 10, baseCost: 160, costMultiplier: 1.6, effect: 1 },
    attackSpeed: { maxLevel: 10, baseCost: 170, costMultiplier: 1.5, effect: 0.05 },
    critRate: { maxLevel: 10, baseCost: 200, costMultiplier: 1.6, effect: 0.02 },
    coinBonus: { maxLevel: 10, baseCost: 250, costMultiplier: 1.7, effect: 0.1 },
    coinDropRate: { maxLevel: 10, baseCost: 220, costMultiplier: 1.6, effect: 0.01 }
};

function getPermanentUpgrades() {
    const defaultUpgrades = {
        baseHp: 0,
        baseDamage: 0,
        baseSpeed: 0,
        rerolls: 0,
        expGain: 0,
        pickupRange: 0,
        armor: 0,
        attackSpeed: 0,
        critRate: 0,
        coinBonus: 0,
        coinDropRate: 0
    };
    
    const saved = localStorage.getItem('permanent_upgrades');
    if (!saved) {
        return defaultUpgrades;
    }
    
    // Merge saved data with default to handle new properties
    const savedData = JSON.parse(saved);
    return { ...defaultUpgrades, ...savedData };
}

function savePermanentUpgrades(upgrades) {
    localStorage.setItem('permanent_upgrades', JSON.stringify(upgrades));
}

function getUpgradeCost(upgradeType, currentLevel) {
    const upgrade = PERMANENT_UPGRADES[upgradeType];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

window.toggleUpgradeShop = () => {
    const screen = document.getElementById('upgrade-shop-screen');
    const titleScreen = document.getElementById('title-screen');
    
    if (screen.classList.contains('hidden')) {
        // Show upgrade shop
        updateUpgradeShop();
        titleScreen.classList.add('hidden');
        screen.classList.remove('hidden');
    } else {
        // Hide upgrade shop
        screen.classList.add('hidden');
        titleScreen.classList.remove('hidden');
    }
};

function updateUpgradeShop() {
    const upgradeList = document.getElementById('upgrade-list');
    const coinCount = document.getElementById('shop-coin-count');
    if (!upgradeList || !coinCount) return;
    
    const totalCoins = parseInt(localStorage.getItem('total_coins') || '0');
    coinCount.innerText = totalCoins;
    
    upgradeList.innerHTML = '';
    
    const upgrades = getPermanentUpgrades();
    
    const upgradeConfigs = [
        { id: 'baseHp', nameKey: 'upgrade_base_hp', icon: '❤️' },
        { id: 'baseDamage', nameKey: 'upgrade_base_damage', icon: '⚔️' },
        { id: 'baseSpeed', nameKey: 'upgrade_base_speed', icon: '⚡' },
        { id: 'rerolls', nameKey: 'upgrade_rerolls', icon: '🔄' },
        { id: 'expGain', nameKey: 'upgrade_exp_gain', icon: '📈' },
        { id: 'pickupRange', nameKey: 'upgrade_pickup_range', icon: '🧲' },
        { id: 'armor', nameKey: 'upgrade_armor', icon: '🛡️' },
        { id: 'attackSpeed', nameKey: 'upgrade_attack_speed', icon: '⚡' },
        { id: 'critRate', nameKey: 'upgrade_crit_rate', icon: '🎯' },
        { id: 'coinBonus', nameKey: 'upgrade_coin_bonus', icon: '💰' },
        { id: 'coinDropRate', nameKey: 'upgrade_coin_drop_rate', icon: '🍀' }
    ];
    
    upgradeConfigs.forEach(config => {
        const currentLevel = upgrades[config.id];
        const maxLevel = PERMANENT_UPGRADES[config.id].maxLevel;
        const cost = getUpgradeCost(config.id, currentLevel);
        const isMaxLevel = currentLevel >= maxLevel;
        const canAfford = totalCoins >= cost;
        
        const card = document.createElement('div');
        card.className = 'upgrade-card' + (isMaxLevel ? ' max-level' : '');
        
        let effectText = '';
        const effect = PERMANENT_UPGRADES[config.id].effect;
        if (config.id === 'baseHp') {
            effectText = `+${effect * currentLevel} HP`;
        } else if (config.id === 'armor') {
            effectText = `+${currentLevel}`;
        } else if (config.id === 'rerolls') {
            effectText = `+${currentLevel}`;
        } else if (config.id === 'baseDamage' || config.id === 'baseSpeed' || config.id === 'expGain' || config.id === 'pickupRange' || config.id === 'attackSpeed' || config.id === 'critRate' || config.id === 'coinBonus' || config.id === 'coinDropRate') {
            effectText = `+${(effect * currentLevel * 100).toFixed(0)}%`;
        }
        
        card.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${config.icon} ${t(config.nameKey)}</div>
                <div class="upgrade-level">Lv. ${currentLevel} / ${maxLevel}</div>
                <div class="upgrade-effect">${effectText}</div>
            </div>
            <button class="upgrade-buy-btn ${isMaxLevel ? 'max' : ''}" 
                    onclick="buyUpgrade('${config.id}')" 
                    ${isMaxLevel || !canAfford ? 'disabled' : ''}>
                ${isMaxLevel ? t('max_level') : `💰 ${cost}`}
            </button>
        `;
        
        upgradeList.appendChild(card);
    });
}

window.buyUpgrade = (upgradeType) => {
    const totalCoins = parseInt(localStorage.getItem('total_coins') || '0');
    const upgrades = getPermanentUpgrades();
    const currentLevel = upgrades[upgradeType];
    const maxLevel = PERMANENT_UPGRADES[upgradeType].maxLevel;
    
    if (currentLevel >= maxLevel) {
        return;
    }
    
    const cost = getUpgradeCost(upgradeType, currentLevel);
    
    if (totalCoins < cost) {
        audioManager.playSFX('hurt');
        alert(t('insufficient_funds'));
        return;
    }
    
    // Deduct coins
    localStorage.setItem('total_coins', (totalCoins - cost).toString());
    
    // Increase upgrade level
    upgrades[upgradeType] = currentLevel + 1;
    savePermanentUpgrades(upgrades);
    
    // Play sound and update UI
    audioManager.playSFX('levelup');
    updateUpgradeShop();
};

// --- INIT ---
updateTexts();
