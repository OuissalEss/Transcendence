import {Ball} from '../types/game.service';
import {Paddle} from "./paddle.class";

export class Puck {
    private x;
    private y;
    private xspeed;
    private yspeed;
    private r;
    private width;
    private height;
    private leftScore;
    private rightScore;

    constructor(width, height) {
        this.x = width / 2;
        this.y = height / 2; // Corrected assignment
        this.xspeed = 5;
        this.yspeed = 5;
        this.r = 10;
        this.width = width;
        this.height = height;
        this.leftScore = 0;
        this.rightScore = 0;
    }

    getpuck() : Ball {
        return {
            x: this.x,
            y: this.y,
            dx: this.xspeed,
            dy: this.yspeed,
            r: this.r,
            canvasH: this.height,
            canvasW: this.width
        }
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    private randomAngle(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    reset(): void {
        this.x = this.width / 2;
        this.y = this.height / 2;

        const angle = this.randomAngle(-Math.PI/4, Math.PI/4);
        this.xspeed = 6 * Math.cos(angle);
        this.yspeed = 6 * Math.cos(angle);
    }

    checkPaddleLeft(paddle: Paddle) {
        const p = paddle.getState();

        const widthScaleFactor = this.width / p.canvasW;
        const heightScaleFactor = this.height / p.canvasH;

        // Update width and height properties
        p.canvasW = this.width ;
        p.canvasH = this.height;

        p.w = 14;
        p.h = this.height / 5;

        // Scale the existing coordinates based on the calculated scale factors
        p.x *= widthScaleFactor;
        p.y *= heightScaleFactor;

        // Ensure the paddle stays within canvas bounds after scaling
        p.x = this.constrain(p.x, p.w / 2, p.canvasW - p.w / 2);
        p.y = this.constrain(p.y, p.h / 2, p.canvasH - p.h / 2);

        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x - this.r < p.x + p.w/2) {
            if (this.x > p.x) {
                let diff = this.y - (p.y - p.h/2);
                let rad = this.radians(45);
                let angle = this.map(diff, 0, p.h, -rad, rad);
                this.xspeed = 6 * Math.cos(angle);
                this.yspeed = 6 * Math.sin(angle);
                this.x = p.x + p.w/2 + this.r;
            }
        }
    }
    checkPaddleRight(paddle: Paddle) {
        const p = paddle.getState();

        const widthScaleFactor = this.width / p.canvasW;
        const heightScaleFactor = this.height / p.canvasH;

        // Update width and height properties
        p.canvasW = this.width ;
        p.canvasH = this.height;

        p.w = 14;
        p.h = this.height / 5;

        // Scale the existing coordinates based on the calculated scale factors
        p.x *= widthScaleFactor;
        p.y *= heightScaleFactor;

        // Ensure the paddle stays within canvas bounds after scaling
        p.x = this.constrain(p.x, p.w / 2, p.canvasW - p.w / 2);
        p.y = this.constrain(p.y, p.h / 2, p.canvasH - p.h / 2);

        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x + this.r > p.x - p.w/2) {

            if (this.x < p.x) {
                let diff = this.y - (p.y - p.h/2);
                let angle = this.map(diff, 0, p.h, this.radians(225), this.radians(135));
                this.xspeed = 6 * Math.cos(angle);
                this.yspeed = 6 * Math.sin(angle);
                this.x = p.x - p.w/2 - this.r;
            }
        }
    }
    
    private constrain(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
    private radians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }

    edges(): boolean {
        if (this.y < 15 || this.y > this.height - 15) {
            this.yspeed *= -1;
        }

        if (this.x - this.r > this.width) {
            this.leftScore++;
            this.reset();
            return true;
        }

        if (this.x + this.r < 0) {
            this.rightScore++;
            this.reset();
            return true
        }
        return false;
    }

    getLeftScore() {
        return this.leftScore;
    }

    getRightScore() {
        return this.rightScore;
    }
}