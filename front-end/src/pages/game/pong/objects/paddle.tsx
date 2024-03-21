// Paddle.tsx

import { gameConfig } from '../constants';

export class Paddle {
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private p: any;
    private speed: number;
    private isLeft: boolean;
    private ychange: number;
    private width: number;
    private height: number;

    constructor(p: any, isLeft: boolean) {
        this.x = gameConfig.canvasWidth / 2;
        this.y = gameConfig.canvasHeight / 2;


        this.p = p;

        this.w = gameConfig.paddleWidth;
        this.h = gameConfig.canvasHeight / 5 ;

        this.width = gameConfig.canvasWidth;
        this.height = gameConfig.canvasHeight;

        this.speed = 5;
        this.isLeft = isLeft;
        this.ychange = 0;

        this.x = isLeft ? this.w + 2: gameConfig.canvasWidth - this.w - 2;
    }

    update(socket: any) {
        // Calculate the scale factor for both width and height
        const widthScaleFactor = gameConfig.canvasWidth / this.width;
        const heightScaleFactor = gameConfig.canvasHeight / this.height;

        // Update width and height properties
        this.width = gameConfig.canvasWidth ;
        this.height = gameConfig.canvasHeight;

        this.w = gameConfig.paddleWidth;
        this.h = gameConfig.canvasHeight / 5 ;

        if (gameConfig.windowW < 768) {
            this.w = gameConfig.canvasWidth / 50;
            this.h = gameConfig.canvasHeight / 4;
        }

        this.x *= widthScaleFactor;
        this.y *= widthScaleFactor;

        if (this.isLeft) {
            if (this.p.keyIsDown(this.p.UP_ARROW)) {
                socket.emit('updatePaddleMovement', 'up');
                this.y -= this.speed;
            } else if (this.p.keyIsDown(this.p.DOWN_ARROW)) {
                socket.emit('updatePaddleMovement', 'down');
                this.y += this.speed;
            }
        } else {
            if (this.p.keyIsDown(87)) { // 'W' key
                socket.emit('updatePaddleMovement', 'up');
                this.y -= this.speed;
            } else if (this.p.keyIsDown(83)) { // 'S' key
                socket.emit('updatePaddleMovement', 'down');
                this.y += this.speed;
            }
        }

        this.y = this.p.constrain(this.y, this.h / 2, this.p.height - this.h / 2);
    }

    reset() {
        this.x = gameConfig.canvasWidth / 2;
        this.y = gameConfig.canvasHeight / 2;

        this.w = gameConfig.paddleWidth;
        this.h = gameConfig.canvasHeight / 5 ;

        this.speed = 5;
        this.ychange = 0;

        this.x = this.isLeft ? gameConfig.paddleWidth : gameConfig.canvasWidth - gameConfig.paddleWidth;
    }

    show() {
        this.p.fill(255);
        this.p.rectMode(this.p.CENTER);
        const cornerRadius = 10;
        this.p.rect(this.x, this.y, this.w, this.h, cornerRadius);
    }
}