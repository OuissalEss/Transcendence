// Paddle.tsx

import { gameConfig } from '../constants';

export class oPaddle {
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

    constructor(p: any, op: any) {
        this.x = op.x;
        this.y = op.y;

        
        this.p = p;
        
        this.w = op.w;
        this.h = op.h;
        
        this.width = op.width;
        this.height = op.height;

        this.speed = 5;
        this.isLeft = true;
        this.ychange = 0;
        
        this.x = true ? this.w + 2: gameConfig.canvasWidth - this.w - 2;
    }

    update(op: any) {
        this.x = op.x;
        this.y = op.y;
        this.w = op.w;
        this.h = op.h;
        this.height = op.height;
        this.width  = op.width;
        // Calculate the scale factor for both width and height
        const widthScaleFactor = gameConfig.canvasWidth / this.width;
        const heightScaleFactor = gameConfig.canvasHeight / this.height;

        // Update width and height properties
        this.width = gameConfig.canvasWidth ;
        this.height = gameConfig.canvasHeight;

        this.w = 14;
        this.h = this.height / 5;

        if (gameConfig.windowW < 768) {
            this.w = gameConfig.canvasWidth / 50;
            this.h = this.height / 4;
        }

        this.x *= widthScaleFactor;
        this.y *= heightScaleFactor;
        
        this.x = this.p.constrain(this.x, this.w / 2, this.p.width - this.w / 2);
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