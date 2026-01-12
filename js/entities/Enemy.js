import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export class Enemy {
    constructor(type) {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { // Top
            this.x = Math.random() * GAME_WIDTH;
            this.y = -20;
        } else if (side === 1) { // Right
            this.x = GAME_WIDTH + 20;
            this.y = Math.random() * GAME_HEIGHT;
        } else if (side === 2) { // Bottom
            this.x = Math.random() * GAME_WIDTH;
            this.y = GAME_HEIGHT + 20;
        } else { // Left
            this.x = -20;
            this.y = Math.random() * GAME_HEIGHT;
        }

        this.radius = type.radius;
        this.speed = type.speed + Math.random() * 0.3;
        this.hp = type.hp;
        this.damage = type.damage;
        this.color = type.color;
        this.exp = type.exp || 5;
    }

    update(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
