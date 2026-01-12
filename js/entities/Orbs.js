export class ExpOrb {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.radius = 4;

        if (value >= 100) {
            this.color = '#9b59b6';
            this.radius = 8;
        } else if (value >= 25) {
            this.color = '#f1c40f';
            this.radius = 6;
        } else if (value >= 10) {
            this.color = '#3498db';
            this.radius = 5;
        } else {
            this.color = '#2ecc71';
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

export class DamageNumber {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = Math.floor(value);
        this.life = 60;
        this.vy = -1;
        this.alpha = 1.0;

        const gb = Math.floor(Math.max(50, 255 - (this.value * 3)));
        this.colorStr = `${gb}, ${gb}`;
    }

    update() {
        this.y += this.vy;
        this.life--;
        this.alpha = Math.max(0, this.life / 30);
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, ${this.colorStr}, ${this.alpha})`;
        ctx.font = 'bold 20px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';

        ctx.strokeText(this.value, this.x, this.y);
        ctx.fillText(this.value, this.x, this.y);
    }
}
