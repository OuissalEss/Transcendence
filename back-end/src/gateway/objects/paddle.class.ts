import { CanvasConfig } from "../types/game.service";

export class Paddle {
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private readonly id: string;
    private ychange: number;
    private speed: number;
    private width: number;
    private height: number;
    private isLeft: boolean;
    private mode: string;
    private computerSpeed: number; // New property for computer-controlled paddle

    constructor(playerId: string, isLeft: boolean, canvasWidth: number, canvasHeight: number, mode: string) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        this.w = 14;
        this.h = canvasHeight / 5;


        this.speed = 5;
        this.ychange = 0;

        this.id = playerId;

        this.mode = mode;
        this.width = canvasWidth;
        this.height = canvasHeight;

        this.computerSpeed = 8;

        this.isLeft = isLeft;

        this.x = isLeft ? this.w + 2 : canvasWidth - this.w - 2;
    }

    reset() {
        this.x = this.width / 2;
        this.y = this.height / 2;

        this.w = 14;
        this.h = this.height / 5;

        this.speed = 5;
        this.ychange = 0;

        this.x = this.isLeft ? this.w + 2 : this.width - this.w - 2;
    }

    // GETTERS
    getState() {
        return {
            x: this.x,
            y: this.y,
            h: this.h,
            w: this.w,
            id: this.id,
            ychange: this.ychange,
            speed: this.speed,
            canvasW: this.width,
            canvasH: this.height,
        }
    }

    update(data: any) {
        if (this.isLeft == false && this.mode == "ai") {
            // Computer AI logic with continuous prediction
            const predictionFactor = 0.5; // Adjust the factor as needed

            // Estimate the future position of the ball based on its direction and speed
            const predictedY = data.y + data.dy * predictionFactor; // Adjust the factor as needed

            // Ensure the predicted y-coordinate stays within the canvas bounds
            const targetY = this.constrain(predictedY, this.h / 2, this.height - this.h / 2);


            // Check if the predicted position of the ball is approaching the paddle
            if (data.dx > 0) { // Ball is moving towards the paddle
                // Check if the predicted Y-coordinate is within a certain range
                const predictionRange = this.height / 4; // Adjust the range as needed
                const isApproaching = targetY > this.y - predictionRange && targetY < this.y + predictionRange;

                if (isApproaching) {
                    // Smoothly move towards the continuously predicted y-coordinate
                    const yDifference = targetY - this.y;
                    const direction = yDifference > 0 ? 1 : -1;

                    // Adjust the computerSpeed based on the distance to the target
                    const distanceToTarget = Math.abs(yDifference);
                    const adjustedSpeed = Math.min(this.computerSpeed, distanceToTarget);

                    this.y += direction * adjustedSpeed;

                    // Ensure the paddle stays within the canvas bounds
                    this.x = this.constrain(this.x, this.w / 2, this.width - this.w / 2);
                    this.y = this.constrain(this.y, this.h / 2, this.height - this.h / 2);
                }
            }
            this.x = this.isLeft ? this.w + 2 : this.width - this.w - 2;

            this.y = this.constrain(this.y, this.h / 2, this.height - this.h / 2);
            this.x = this.constrain(this.x, this.w / 2, this.width - this.w / 2);
        }
    }
    updateMovement(movement: string) {
        if (this.isLeft) {
            if (movement === 'up') {
                this.y -= this.speed;
            } else if (movement === 'down') {
                this.y += this.speed;
            }
        } else if (this.isLeft == false && this.mode != 'ai') {
            if (movement === 'up') {
                this.y -= this.speed;
            } else if (movement === 'down') {
                this.y += this.speed;
            }
        }

        // Ensure paddle stays within canvas bounds
        this.y = this.constrain(this.y, this.h / 2, this.height - this.h / 2);
    }

    private constrain(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    getPaddle() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            ychange: this.ychange,
            speed: this.speed,
            canvasW: this.width,
            canvasH: this.height,
        }
    }

    updateScale(canvasConfig: CanvasConfig) {
        // Calculate the scale factor for both width and height
        const widthScaleFactor = canvasConfig.canvasW / this.width;
        const heightScaleFactor = canvasConfig.canvasH / this.height;

        // Update width and height properties
        this.width = canvasConfig.canvasW;
        this.height = canvasConfig.canvasH;

        this.w = 14;
        this.h = this.height / 5;

        if (canvasConfig.windowW < 768) {
            this.w = canvasConfig.canvasW / 50;
            this.h = this.height / 4;
        }

        // Scale the existing coordinates based on the calculated scale factors
        this.x *= widthScaleFactor;
        this.y *= heightScaleFactor;

        this.x = this.isLeft ? this.w + 2 : this.width - this.w - 2;

        // Ensure the paddle stays within canvas bounds after scaling
        this.x = this.constrain(this.x, this.w / 2, this.width - this.w / 2);
        this.y = this.constrain(this.y, this.h / 2, this.height - this.h / 2);
    }
}
