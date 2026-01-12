export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const ENEMY_TYPES = [
    { color: '#e74c3c', speed: 1.0, hp: 10, radius: 12, damage: 5, exp: 5 },    // 0-30s: Basic Red
    { color: '#00d2d3', speed: 2.0, hp: 8, radius: 10, damage: 8, exp: 10 },    // 30-60s: Fast Cyan
    { color: '#10ac84', speed: 0.6, hp: 50, radius: 20, damage: 15, exp: 25 },  // 60-90s: Tank Green
    { color: '#5f27cd', speed: 1.3, hp: 120, radius: 15, damage: 20, exp: 100 },// 90-120s: Elite Purple
    { color: '#e67e22', speed: 1.5, hp: 80, radius: 12, damage: 15, exp: 80 },  // 120-150s: Swarm Orange
    { color: '#2980b9', speed: 1.8, hp: 200, radius: 18, damage: 25, exp: 200 },// 150-180s: Fast Tank Blue
    { color: '#2c3e50', speed: 0.8, hp: 500, radius: 25, damage: 40, exp: 500 },// 180-210s: High HP Black
    { color: '#ecf0f1', speed: 2.5, hp: 150, radius: 15, damage: 30, exp: 300 },// 210-240s: Ghost (White)
    { color: '#8e44ad', speed: 1.0, hp: 1000, radius: 40, damage: 50, exp: 1000 },// 240-270s: Giant Badge
    { color: '#c0392b', speed: 1.5, hp: 2000, radius: 20, damage: 60, exp: 2000 } // 270-300s: Final Wave
];

export const CHARACTERS = {
    knight: { hp: 150, armor: 2, magnetRadius: 25, attackDamage: 1.0, attackFrequency: 1.0, moveSpeed: 2.5, attackSpeed: 1.0, projSpeed: 1.0, rerolls: 2, color: '#3498db' },
    rogue: { hp: 70, armor: 0, magnetRadius: 50, attackDamage: 1.0, attackFrequency: 1.1, moveSpeed: 4.0, attackSpeed: 1.2, projSpeed: 1.2, rerolls: 4, color: '#2ecc71' },
    mage: { hp: 80, armor: 0, magnetRadius: 35, attackDamage: 1.2, attackFrequency: 1.3, moveSpeed: 3.0, attackSpeed: 1.0, projSpeed: 0.8, rerolls: 2, color: '#9b59b6' }
};

export const RARITIES = {
    common: { id: 'common', mult: 1.0, prob: 0.70, color: '#ffffff' },
    uncommon: { id: 'uncommon', mult: 1.5, prob: 0.20, color: '#2ecc71' },
    great: { id: 'great', mult: 2.5, prob: 0.08, color: '#3498db' },
    legend: { id: 'legend', mult: 4.0, prob: 0.02, color: '#f1c40f' }
};

export const WEAPON_RARITIES = {
    common: { id: 'common', mult: 1.0, prob: 0.40, color: '#ffffff' },
    uncommon: { id: 'uncommon', mult: 1.5, prob: 0.30, color: '#2ecc71' },
    great: { id: 'great', mult: 2.5, prob: 0.20, color: '#3498db' },
    legend: { id: 'legend', mult: 4.0, prob: 0.10, color: '#f1c40f' }
};

export const WEAPON_UPGRADES = {
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

export const SKILL_UPGRADES = {
    muscle: [
        { level: 2, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] },
        { level: 3, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] },
        { level: 4, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] },
        { level: 5, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] },
        { level: 6, upgrades: [{ type: 'passive_damage', val: 0.1, descKey: 'skill_muscle_up' }] },
    ],
    heart: [
        { level: 2, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] },
        { level: 3, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] },
        { level: 4, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] },
        { level: 5, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] },
        { level: 6, upgrades: [{ type: 'passive_hp', val: 0.2, descKey: 'skill_heart_up' }] },
    ],
    tome: [
        { level: 2, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] },
        { level: 3, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] },
        { level: 4, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] },
        { level: 5, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] },
        { level: 6, upgrades: [{ type: 'passive_speed', val: 0.08, descKey: 'skill_tome_up' }] },
    ],
    scope: [
        { level: 2, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] },
        { level: 3, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] },
        { level: 4, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] },
        { level: 5, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] },
        { level: 6, upgrades: [{ type: 'passive_area', val: 0.1, descKey: 'skill_scope_up' }] },
    ],
    duplicator: [
        { level: 2, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] },
        { level: 3, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] },
        { level: 4, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] },
        { level: 5, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] },
        { level: 6, upgrades: [{ type: 'passive_amount', val: 1, descKey: 'skill_duplicator_up' }] },
    ],
    magnet: [
        { level: 2, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] },
        { level: 3, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] },
        { level: 4, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] },
        { level: 5, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] },
        { level: 6, upgrades: [{ type: 'passive_magnet', val: 0.2, descKey: 'skill_magnet_up' }] },
    ],
    wings: [
        { level: 2, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] },
        { level: 3, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] },
        { level: 4, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] },
        { level: 5, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] },
        { level: 6, upgrades: [{ type: 'passive_move_speed', val: 0.1, descKey: 'skill_wings_up' }] },
    ],
    crown: [
        { level: 2, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] },
        { level: 3, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] },
        { level: 4, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] },
        { level: 5, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] },
        { level: 6, upgrades: [{ type: 'passive_exp', val: 0.08, descKey: 'skill_crown_up' }] },
    ],
    armor: [
        { level: 2, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] },
        { level: 3, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] },
        { level: 4, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] },
        { level: 5, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] },
        { level: 6, upgrades: [{ type: 'passive_armor', val: 1, descKey: 'skill_armor_up' }] },
    ],
    pummarola: [
        { level: 2, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] },
        { level: 3, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] },
        { level: 4, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] },
        { level: 5, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] },
        { level: 6, upgrades: [{ type: 'passive_regen', val: 0.2, descKey: 'skill_pummarola_up' }] },
    ],
    bracer: [
        { level: 2, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] },
        { level: 3, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] },
        { level: 4, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] },
        { level: 5, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] },
        { level: 6, upgrades: [{ type: 'passive_proj_speed', val: 0.1, descKey: 'skill_bracer_up' }] },
    ],
    spellbinder: [
        { level: 2, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] },
        { level: 3, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] },
        { level: 4, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] },
        { level: 5, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] },
        { level: 6, upgrades: [{ type: 'passive_duration', val: 0.1, descKey: 'skill_spellbinder_up' }] },
    ]
};

export const ALL_WEAPON_TYPES = ['orbit', 'wand', 'aura', 'knife', 'holy_water', 'lightning'];
export const ALL_SKILL_TYPES = ['muscle', 'heart', 'tome', 'scope', 'duplicator', 'magnet', 'wings', 'crown', 'armor', 'pummarola', 'bracer', 'spellbinder'];
