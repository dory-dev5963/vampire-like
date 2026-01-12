import { t, updateTexts } from './localization.js';
import { ALL_WEAPON_TYPES, ALL_SKILL_TYPES, SKILL_UPGRADES, WEAPON_UPGRADES, RARITIES, WEAPON_RARITIES } from './config.js';

export function toggleSettings(gameState) {
    const modal = document.getElementById('settings-modal');
    modal.classList.toggle('hidden');
    const btn = document.getElementById('btn-toggle-dmg');
    if (btn) btn.innerText = gameState.showDamageNumbers ? t('settings_hide_dmg') : t('settings_show_dmg');
    document.body.classList.toggle('settings-active');
}

export function toggleDamageNumbers(gameState) {
    gameState.showDamageNumbers = !gameState.showDamageNumbers;
    const btn = document.getElementById('btn-toggle-dmg');
    if (btn) {
        btn.innerText = gameState.showDamageNumbers ? t('settings_hide_dmg') : t('settings_show_dmg');
    }
}

export function updateUI(gameTime, player) {
    if (!player) return;
    document.getElementById('time').innerText = `${t('time')}${Math.floor(gameTime)}`;
    document.getElementById('level').innerText = `${t('level')}${player.level}`;

    const hpPercent = (player.hp / player.maxHp) * 100;
    const hpFill = document.getElementById('hp-bar-fill');
    if (hpFill) hpFill.style.width = `${Math.max(0, hpPercent)}%`;
    const hpText = document.getElementById('hp-text');
    if (hpText) hpText.innerText = `${Math.floor(player.hp)}/${player.maxHp}`;

    const expPercent = (player.exp / player.nextLevelExp) * 100;
    const expFill = document.getElementById('exp-bar-fill');
    if (expFill) expFill.style.width = `${Math.max(0, expPercent)}%`;
    const expText = document.getElementById('exp-text');
    if (expText) expText.innerText = `${Math.floor(player.exp)}/${player.nextLevelExp}`;
}

export function updateInventory(player) {
    const inv = document.getElementById('inventory');
    if (!inv || !player) return;
    inv.innerHTML = '';

    const createRow = (items, prefix) => {
        const row = document.createElement('div');
        row.className = 'inv-row';
        items.forEach(item => {
            const container = document.createElement('div');
            container.style.position = 'relative';
            const img = document.createElement('img');
            img.src = `assets/${item.type}.svg`;
            img.className = 'inv-icon';
            img.title = prefix === 'skill_' ? t(prefix + item.type) : item.type;
            const badge = document.createElement('div');
            badge.className = 'level-badge';
            badge.innerText = `Lv.${item.level}`;
            container.appendChild(img);
            container.appendChild(badge);
            row.appendChild(container);
        });
        return row;
    };

    inv.appendChild(createRow(player.weapons, ''));
    inv.appendChild(createRow(player.skills, 'skill_'));
}

export function getRandomRarity(isWeapon = false) {
    const table = isWeapon ? WEAPON_RARITIES : RARITIES;
    const rand = Math.random();
    let cumulative = 0;
    for (const key in table) {
        cumulative += table[key].prob;
        if (rand < cumulative) return table[key];
    }
    return table.common;
}

export function showLevelUpMenu(gameState, audioManager, onChoiceMade) {
    gameState.isPaused = true;
    audioManager.playSFX('levelup');
    const modal = document.getElementById('level-up-modal');
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    modal.classList.remove('hidden');

    const player = gameState.player;
    const rerollBtn = document.getElementById('reroll-btn');
    const rerollCount = document.getElementById('reroll-count');
    if (rerollCount) rerollCount.innerText = player.rerolls;
    if (rerollBtn) rerollBtn.disabled = player.rerolls <= 0;

    const allOptions = [];

    const scaleUpgrades = (baseUpgrades, rarity) => {
        return baseUpgrades.map(u => {
            let newVal = u.val;
            if (typeof u.val === 'number') {
                if (['count', 'passive_amount', 'passive_armor'].includes(u.type)) {
                    newVal = Math.ceil(u.val * rarity.mult);
                } else {
                    newVal = u.val * rarity.mult;
                }
            }
            return { ...u, val: newVal };
        });
    };

    const getFullDesc = (upgrades) => {
        return upgrades.map(u => {
            const base = t(u.descKey);
            if (['count', 'passive_amount', 'passive_armor'].includes(u.type)) {
                return `${base} (+${u.val})`;
            }
            return `${base} (x${u.val > 0 ? (1 + u.val).toFixed(2) : (1 - u.val).toFixed(2)})`;
        }).join(', ');
    };

    // Skills
    player.skills.forEach(skill => {
        if (skill.level < skill.maxLevel) {
            const nextUpgrade = SKILL_UPGRADES[skill.type].find(u => u.level === skill.level + 1);
            if (nextUpgrade) {
                const rarity = getRandomRarity(false);
                const scaled = scaleUpgrades(nextUpgrade.upgrades, rarity);
                allOptions.push({
                    category: 'label_skill', rarity,
                    name: `${t('upgrade')} ${t('skill_' + skill.type)} (Lv ${skill.level} -> ${skill.level + 1}): ${getFullDesc(scaled)}`,
                    icon: `assets/${skill.type}.svg`,
                    action: () => { player.upgradeSkill(skill.type, scaled); onChoiceMade(); }
                });
            }
        }
    });

    if (player.skills.length < player.maxSkills) {
        ALL_SKILL_TYPES.filter(type => !player.hasSkill(type)).forEach(type => {
            const rarity = getRandomRarity(false);
            allOptions.push({
                category: 'label_skill', rarity,
                name: `${t('skill_' + type)} (${t('affects')}${t(t('scope_' + type))}): ${t('skill_' + type + '_desc')}`,
                icon: `assets/${type}.svg`,
                action: () => { player.addSkill(type); onChoiceMade(); }
            });
        });
    }

    // Weapons
    player.weapons.forEach(weapon => {
        if (weapon.level < weapon.maxLevel) {
            const nextUpgrade = WEAPON_UPGRADES[weapon.type].find(u => u.level === weapon.level + 1);
            if (nextUpgrade) {
                const rarity = getRandomRarity(true);
                const scaled = scaleUpgrades(nextUpgrade.upgrades, rarity);
                allOptions.push({
                    category: 'label_weapon', rarity,
                    name: `${t('upgrade')} ${t(weapon.type + '_weapon')} (Lv ${weapon.level} -> ${weapon.level + 1}): ${getFullDesc(scaled)}`,
                    icon: `assets/${weapon.type}.svg`,
                    action: () => { weapon.upgrade(scaled); onChoiceMade(); }
                });
            }
        }
    });

    if (player.weapons.length < player.maxWeapons) {
        ALL_WEAPON_TYPES.filter(type => !player.hasWeapon(type)).forEach(type => {
            const rarity = getRandomRarity(true);
            allOptions.push({
                category: 'label_weapon', rarity,
                name: t(type + "_weapon"),
                icon: `assets/${type}.svg`,
                action: () => { player.addWeapon(type); onChoiceMade(); }
            });
        });
    }

    if (allOptions.length === 0) {
        allOptions.push({ category: 'label_skill', rarity: RARITIES.common, name: t("heal"), icon: "assets/heart.svg", action: () => { player.hp = Math.min(player.maxHp, player.hp + 50); onChoiceMade(); } });
    }

    const shuffled = allOptions.sort(() => 0.5 - Math.random());
    shuffled.slice(0, 3).forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'level-up-option';
        btn.style.borderColor = opt.rarity.color;
        btn.style.boxShadow = `0 0 10px ${opt.rarity.color}44`;
        btn.innerHTML = `
            <img src="${opt.icon}">
            <div style="flex-grow:1">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size: 12px; color: #aaa;">${t(opt.category)}</span>
                    <span style="font-size: 10px; font-weight: bold; color: ${opt.rarity.color}">${t('rarity_' + opt.rarity.id)}</span>
                </div>
                <div style="font-weight:bold; margin-top:2px;">${opt.name}</div>
            </div>
        `;
        btn.onclick = opt.action;
        choicesDiv.appendChild(btn);
    });
}
