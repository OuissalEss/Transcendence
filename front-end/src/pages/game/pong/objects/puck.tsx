import { gameConfig } from '../constants';

export class Puck {
    private x: number;
    private y: number;
    private p: any; // Assuming you're using p5.js
    private xspeed: number;
    private yspeed: number;
    private r: number;

    constructor(p: any) {
        this.x = gameConfig.canvasWidth / 2;
        this.y = gameConfig.canvasHeight / 2;
        this.p = p;
        this.xspeed = 2;
        this.yspeed = 2;
        this.r = 0;
    }

    getBallSize() {
        const { windowW } = gameConfig;
        if (windowW >= 1300) return gameConfig.ballSizes.large;
        else if (windowW < 1300 && windowW >= 992) return gameConfig.ballSizes.medium;
        else if (windowW < 992 && windowW >= 768) return gameConfig.ballSizes.small;
        else if (windowW < 768) return gameConfig.ballSizes.extraSmall;
    }

    show() {
        this.p.fill(255);
        const ballSize = this.getBallSize();
        this.p.ellipse(this.x, this.y, ballSize, ballSize);
    }

    ballUpdate(newBallData: any, canvasW: number, canvasH: number) {
        const xScaleFactor = canvasW / newBallData.canvasW;
        const yScaleFactor = canvasH / newBallData.canvasH;
        this.x = newBallData.x * xScaleFactor;
        this.y = newBallData.y * yScaleFactor;
        this.xspeed = newBallData.dx;
        this.yspeed = newBallData.dy;
        this.r = newBallData.r;

        // Check if the ball hits the right or bottom wall and reverse its direction
        if (this.x <= this.r || this.x >= canvasW - this.r) {
            this.xspeed *= -1;
        }
        if (this.y <= this.r || this.y >= canvasH - this.r) {
            this.yspeed *= -1;
        }
    }
}
