import { GAME_WIDTH, GAME_HEIGHT, ALL_SKILL_TYPES, SKILL_UPGRADES, CHARACTERS, WEAPON_UPGRADES } from '../config.js';
import { createWeapon, applyUpgrade } from './Weapons.js';

export class Player {
    constructor(weaponType, selectedCharacter) {
        const charData = CHARACTERS[selectedCharacter] || CHARACTERS.knight;

        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.radius = 10;
        this.moveSpeed = charData.moveSpeed;
        this.hp = charData.hp;
        this.maxHp = charData.hp;
        this.level = 1;
        this.exp = 0;
        this.nextLevelExp = 10;
        this.magnetRadius = charData.magnetRadius;

        this.weapons = [];
        this.maxWeapons = 3;
        this.addWeapon(weaponType);

        this.color = charData.color || '#3498db';
        this.charType = selectedCharacter;

        this.skills = []; // {type, level, maxLevel}
        this.maxSkills = 3;

        this.attackDamage = charData.attackDamage || 1.0;
        this.damageMult = this.attackDamage;
        this.areaMult = 1.0;
        this.attackFrequency = charData.attackFrequency || 1.0;
        this.attackSpeed = charData.attackSpeed || 1.0;
        this.cooldownMult = 1.0; // Buff from passive skills
        this.projectileCountBonus = 0;
        this.magnetMultiplier = 1.0;
        this.moveSpeedMult = 1.0;
        this.expMult = 1.0;
        this.armor = charData.armor || 0;
        this.regenAmount = 0;
        this.regenTimer = 0;
        this.projectileSpeedMult = charData.projSpeed || 1.0;
        this.durationMult = 1.0;
        this.rerolls = charData.rerolls || 2;
    }

    addSkill(type) {
        if (this.skills.length >= this.maxSkills) return false;
        if (this.hasSkill(type)) return false;

        const skill = { type: type, level: 1, maxLevel: 6 };
        this.skills.push(skill);
        this.recalculateStats();
        return true;
    }

    hasSkill(type) {
        return this.skills.some(s => s.type === type);
    }

    upgradeSkill(type, customUpgrades = null) {
        const skill = this.skills.find(s => s.type === type);
        if (skill && skill.level < skill.maxLevel) {
            skill.level++;

            const upgrades = customUpgrades || SKILL_UPGRADES[type].find(u => u.level === skill.level)?.upgrades;
            if (upgrades) {
                upgrades.forEach(u => this.applySkillStat(u));
            }
        }
    }

    applySkillStat(u) {
        switch (u.type) {
            case 'passive_damage': this.damageMult += u.val; break;
            case 'passive_hp':
                const oldMax = this.maxHp;
                this.maxHp *= (1 + u.val);
                this.hp += (this.maxHp - oldMax);
                break;
            case 'passive_speed': this.cooldownMult += u.val; break;
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

    recalculateStats() {
        const type = this.skills[this.skills.length - 1].type;
        switch (type) {
            case 'muscle': this.damageMult += 0.1; break;
            case 'heart': this.maxHp *= 1.2; this.hp *= 1.2; break;
            case 'tome': this.cooldownMult += 0.1; break;
            case 'scope': this.areaMult += 0.1; break;
            case 'duplicator': break;
            case 'magnet': this.magnetRadius *= 1.25; break;
            case 'wings': this.moveSpeedMult += 0.1; break;
            case 'crown': this.expMult += 0.1; break;
            case 'armor': this.armor += 1; break;
            case 'pummarola': this.regenAmount += 0.2; break;
            case 'bracer': this.projectileSpeedMult += 0.1; break;
            case 'spellbinder': this.durationMult += 0.1; break;
        }
    }

    addWeapon(type) {
        if (this.weapons.length >= this.maxWeapons) return false;
        if (this.hasWeapon(type)) return false;

        const weapon = createWeapon(type, this);
        if (weapon) {
            this.weapons.push(weapon);
            return true;
        }
        return false;
    }

    hasWeapon(type) {
        return this.weapons.some(w => w.type === type);
    }

    get weapon() {
        return this.weapons[0];
    }

    update(keys) {
        let dx = 0;
        let dy = 0;
        if (keys.w || keys.ArrowUp) dy = -1;
        if (keys.s || keys.ArrowDown) dy = 1;
        if (keys.a || keys.ArrowLeft) dx = -1;
        if (keys.d || keys.ArrowRight) dx = 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        this.x += dx * this.moveSpeed * this.moveSpeedMult;
        this.y += dy * this.moveSpeed * this.moveSpeedMult;

        if (this.regenAmount > 0) {
            this.regenTimer++;
            if (this.regenTimer >= 60) {
                this.hp = Math.min(this.maxHp, this.hp + this.regenAmount);
                this.regenTimer = 0;
            }
        }

        this.x = Math.max(this.radius, Math.min(GAME_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(GAME_HEIGHT - this.radius, this.y));

        this.weapons.forEach(w => w.update());
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.charType === 'knight') {
            ctx.arc(this.x, this.y, this.radius - 3, 0.5, Math.PI - 0.5);
        } else if (this.charType === 'rogue') {
            ctx.moveTo(this.x - 4, this.y - 4);
            ctx.lineTo(this.x + 4, this.y + 4);
            ctx.moveTo(this.x + 4, this.y - 4);
            ctx.lineTo(this.x - 4, this.y + 4);
        } else if (this.charType === 'mage') {
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        }
        ctx.stroke();

        this.weapons.forEach(w => w.draw(ctx));
    }

    takeDamage(amount, audioManager, onGameEnd) {
        const dmg = Math.max(1, amount - this.armor);
        this.hp -= dmg;
        audioManager.playSFX('hurt');
        if (this.hp <= 0) {
            this.hp = 0;
            onGameEnd();
        }
    }
}
