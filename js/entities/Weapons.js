import { WEAPON_UPGRADES } from '../config.js';

export function createWeapon(type, owner) {
    switch (type) {
        case 'orbit': return new OrbitWeapon(owner);
        case 'wand': return new WandWeapon(owner);
        case 'aura': return new AuraWeapon(owner);
        case 'knife': return new KnifeWeapon(owner);
        case 'holy_water': return new HolyWaterWeapon(owner);
        case 'lightning': return new LightningWeapon(owner);
    }
    return null;
}

export function applyUpgrade(weapon, upgradeInfo) {
    switch (upgradeInfo.type) {
        case 'passive_damage':
            weapon.damage *= (1 + upgradeInfo.val);
            break;
        case 'passive_speed':
            weapon.cooldown *= (1 - upgradeInfo.val);
            break;
        case 'passive_area':
            weapon.radius *= (1 + upgradeInfo.val);
            break;
        case 'passive_proj_speed':
            if (weapon.projectileSpeed) weapon.projectileSpeed *= (1 + upgradeInfo.val);
            if (weapon.throwSpeed) weapon.throwSpeed *= (1 + upgradeInfo.val);
            break;
        case 'passive_duration':
            if (weapon.duration) weapon.duration *= (1 + upgradeInfo.val);
            break;
        case 'passive_amount': // Duplicate from Player bonus for clarity
            break;
        case 'damage':
            weapon.damage += upgradeInfo.val;
            break;
        case 'speed':
            weapon.cooldown *= (1 - upgradeInfo.val);
            break;
        case 'area':
            weapon.radius *= (1 + upgradeInfo.val);
            break;
        case 'size':
            if (weapon.projectileSize) weapon.projectileSize *= (1 + upgradeInfo.val);
            if (weapon.projectileRadius) weapon.projectileRadius *= (1 + upgradeInfo.val);
            if (weapon.radius) weapon.radius *= (1 + upgradeInfo.val);
            break;
        case 'count':
            if (weapon.projectileCount !== undefined) weapon.projectileCount += upgradeInfo.val;
            if (weapon.chainCount !== undefined) weapon.chainCount += upgradeInfo.val;
            if (weapon.count !== undefined) weapon.count += upgradeInfo.val;
            break;
        case 'duration':
            if (weapon.duration !== undefined) weapon.duration *= (1 + upgradeInfo.val);
            break;
    }
}

class OrbitWeapon {
    constructor(owner) {
        this.owner = owner;
        this.radius = 60;
        this.projectileRadius = 10;
        this.angle = 0;
        this.projectileCount = 2;
        this.rotationSpeed = 0.05;
        this.damage = 15;
        this.type = 'orbit';
        this.level = 1;
        this.maxLevel = 6;
    }
    update() {
        const speedMult = this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult;
        this.angle += this.rotationSpeed * speedMult;
    }
    draw(ctx) {
        ctx.fillStyle = '#f1c40f';
        const totalProjectiles = this.projectileCount + this.owner.projectileCountBonus;
        for (let i = 0; i < totalProjectiles; i++) {
            const currentAngle = this.angle + (i * Math.PI * 2) / totalProjectiles;
            const x = this.owner.x + Math.cos(currentAngle) * (this.radius * this.owner.areaMult);
            const y = this.owner.y + Math.sin(currentAngle) * (this.radius * this.owner.areaMult);
            ctx.beginPath();
            ctx.arc(x, y, this.projectileRadius, 0, Math.PI * 2);
            ctx.fill();
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
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}

class WandWeapon {
    constructor(owner) {
        this.owner = owner;
        this.cooldown = 60;
        this.timer = 0;
        this.projectileSpeed = 7;
        this.projectileSize = 6;
        this.damage = 10;
        this.type = 'wand';
        this.level = 1;
        this.maxLevel = 6;
        this.projectiles = [];
    }
    update() {
        this.timer++;
        const effectiveCooldown = (this.cooldown) / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effectiveCooldown) {
            this.timer = 0;
            this.fire();
        }
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > 800 || p.y < 0 || p.y > 600) this.projectiles.splice(i, 1);
        }
    }
    fire() {
        const total = 1 + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            let targetX = this.owner.x + 100, targetY = this.owner.y;
            this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: this.projectileSpeed * this.owner.projectileSpeedMult, dy: 0, radius: this.projectileSize, damage: this.damage * this.owner.damageMult });
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#3498db';
        this.projectiles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    getHitboxes() { return this.projectiles; }
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}

class AuraWeapon {
    constructor(owner) {
        this.owner = owner;
        this.radius = 80;
        this.damage = 1;
        this.damageInterval = 30;
        this.timer = 0;
        this.type = 'aura';
        this.level = 1;
        this.maxLevel = 6;
    }
    update() {
        this.timer++;
        const effectiveInterval = this.damageInterval / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effectiveInterval) {
            this.timer = 0;
            this.shouldDamage = true;
        } else {
            this.shouldDamage = false;
        }
    }
    draw(ctx) {
        ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
        ctx.beginPath();
        const r = this.radius * this.owner.areaMult;
        ctx.arc(this.owner.x, this.owner.y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    getHitboxes() {
        if (!this.shouldDamage) return [];
        return [{ x: this.owner.x, y: this.owner.y, radius: this.radius * this.owner.areaMult, damage: Math.max(1, Math.floor(this.damage * this.owner.damageMult)) }];
    }
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}

class KnifeWeapon {
    constructor(owner) {
        this.owner = owner;
        this.cooldown = 45;
        this.timer = 0;
        this.projectileSpeed = 10;
        this.projectileSize = 4;
        this.damage = 12;
        this.projectileCount = 1;
        this.type = 'knife';
        this.level = 1;
        this.maxLevel = 6;
        this.projectiles = [];
    }
    update() {
        this.timer++;
        const effectiveCooldown = (this.cooldown) / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effectiveCooldown) {
            this.timer = 0;
            this.fire();
        }
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > 800 || p.y < 0 || p.y > 600) this.projectiles.splice(i, 1);
        }
    }
    fire() {
        const total = this.projectileCount + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            const spread = (i - (total - 1) / 2) * 0.1;
            this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: this.projectileSpeed * this.owner.projectileSpeedMult, dy: spread * 10, radius: this.projectileSize, damage: this.damage * this.owner.damageMult });
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#ecf0f1';
        this.projectiles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    getHitboxes() { return this.projectiles; }
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}

class HolyWaterWeapon {
    constructor(owner) {
        this.owner = owner;
        this.cooldown = 120;
        this.timer = 0;
        this.duration = 180;
        this.radius = 40;
        this.damage = 10;
        this.throwSpeed = 8;
        this.count = 1;
        this.type = 'holy_water';
        this.level = 1;
        this.maxLevel = 6;
        this.zones = [];
        this.projectiles = [];
    }
    update() {
        this.timer++;
        const effectiveCooldown = (this.cooldown) / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effectiveCooldown) {
            this.timer = 0;
            this.fire();
        }
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.dx; p.y += p.dy; p.life--;
            if (p.life <= 0) {
                this.zones.push({ x: p.x, y: p.y, radius: this.radius * this.owner.areaMult, life: this.duration * this.owner.durationMult, maxLife: this.duration * this.owner.durationMult, damage: this.damage * this.owner.damageMult });
                this.projectiles.splice(i, 1);
            }
        }
        for (let i = this.zones.length - 1; i >= 0; i--) {
            const z = this.zones[i];
            z.life--;
            if (z.life <= 0) this.zones.splice(i, 1);
        }
    }
    fire() {
        const total = this.count + this.owner.projectileCountBonus;
        for (let i = 0; i < total; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 100;
            const targetX = this.owner.x + Math.cos(angle) * dist;
            const targetY = this.owner.y + Math.sin(angle) * dist;
            const travelTime = Math.max(5, 30 / this.owner.projectileSpeedMult);
            this.projectiles.push({ x: this.owner.x, y: this.owner.y, dx: (targetX - this.owner.x) / travelTime, dy: (targetY - this.owner.y) / travelTime, life: travelTime });
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#3498db';
        this.projectiles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); });
        this.zones.forEach(z => {
            const alpha = (z.life / z.maxLife) * 0.6;
            ctx.fillStyle = `rgba(231, 76, 60, ${alpha})`;
            ctx.beginPath(); ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2); ctx.fill();
        });
    }
    getHitboxes() { return this.zones; }
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}

class LightningWeapon {
    constructor(owner) {
        this.owner = owner;
        this.cooldown = 90;
        this.timer = 0;
        this.damage = 30;
        this.chainCount = 2;
        this.range = 200;
        this.activeChain = [];
        this.chainTimer = 0;
        this.type = 'lightning';
        this.level = 1;
        this.maxLevel = 6;
    }
    update() {
        this.timer++;
        const effectiveCooldown = (this.cooldown) / (this.owner.attackFrequency * this.owner.attackSpeed * this.owner.cooldownMult);
        if (this.timer >= effectiveCooldown) {
            this.timer = 0;
            this.strike();
        }
        if (this.chainTimer > 0) this.chainTimer--;
    }
    strike() {
        // Implementation logic from main.js (needs gameState passed or imported)
    }
    draw(ctx) {
        if (this.chainTimer > 0 && this.activeChain.length > 1) {
            ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 3; ctx.beginPath();
            ctx.moveTo(this.activeChain[0].x, this.activeChain[0].y);
            for (let i = 1; i < this.activeChain.length; i++) ctx.lineTo(this.activeChain[i].x, this.activeChain[i].y);
            ctx.stroke();
        }
    }
    getHitboxes() { return []; }
    upgrade(customUpgrades = null) {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const upgrades = customUpgrades || WEAPON_UPGRADES[this.type].find(u => u.level === this.level)?.upgrades;
        if (upgrades) upgrades.forEach(u => applyUpgrade(this, u));
    }
}
