import { Socket } from 'socket.io';
import { Ball } from '../types/game.service';
import { Paddle } from "./paddle.class";

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
    private hostSocket;
    private guestSocket;
    private mode;
    private speed;

    constructor(width, height, mode, hostSocket: Socket, guestSocket: Socket) {
        this.x = width / 2;
        this.y = height / 2; // Corrected assignment
        this.xspeed = 5;
        this.yspeed = 5;
        this.r = 10;
        this.width = width;
        this.height = height;
        this.leftScore = 0;
        this.rightScore = 0;
        this.hostSocket = hostSocket;
        this.guestSocket = guestSocket;
        this.mode = mode;
        this.speed = 0;
        console.log("Mode: ", mode);
    }

    getpuck(): Ball {
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

        const angle = this.randomAngle(-Math.PI / 4, Math.PI / 4);

        const angleX = this.randomAngle(-Math.PI / 4, Math.PI / 4);
        const angleY = this.randomAngle(-Math.PI / 4, Math.PI / 4);
        
        this.xspeed = 6 * Math.cos(angleX) + (this.speed );
        this.yspeed = 6 * Math.sin(angleY) + this.speed;

        // this.xspeed = 6 * Math.cos(angle) + this.speed;
        // this.yspeed = 6 * Math.cos(angle) + this.speed;
    }

    checkPaddleLeft(paddle: Paddle) {
        const p = paddle.getState();

        const widthScaleFactor = this.width / p.canvasW;
        const heightScaleFactor = this.height / p.canvasH;

        // Update width and height properties
        p.canvasW = this.width;
        p.canvasH = this.height;

        p.w = 14;
        p.h = this.height / 5;

        // Scale the existing coordinates based on the calculated scale factors
        p.x *= widthScaleFactor;
        p.y *= heightScaleFactor;

        // Ensure the paddle stays within canvas bounds after scaling
        p.x = this.constrain(p.x, p.w / 2, p.canvasW - p.w / 2);
        p.y = this.constrain(p.y, p.h / 2, p.canvasH - p.h / 2);

        if (this.y - this.r < p.y + p.h / 2 &&
            this.y + this.r > p.y - p.h / 2 &&
            this.x - this.r < p.x + p.w / 2) {
            if (this.x > p.x) {
                let diff = this.y - (p.y - p.h / 2);
                let rad = this.radians(45);
                let angle = this.map(diff, 0, p.h, -rad, rad);

                // Calculate the new x and y speeds based on the angle
                // this.xspeed = 6 * Math.cos(angle) + this.speed;;
                // this.yspeed = 6 * Math.sin(angle) + this.speed;;

        // const angleX = this.randomAngle(-Math.PI / 4, Math.PI / 4);
        // const angleY = this.randomAngle(-Math.PI / 4, Math.PI / 4);
        
        // let newX = 6 * Math.cos(angleX);
        // newX = newX < 0 ? -(Math.abs(newX) + this.xspeed) : (Math.abs(newX) + this.xspeed);
        // this.xspeed = newX;

        // this.yspeed = 6 * Math.cos(angleY);
        // this.yspeed = this.yspeed > 0 ? -Math.abs(this.yspeed) : Math.abs(this.yspeed);


         // Calculate the angle based on the difference in y coordinates
         let relativeIntersectY = (p.y + p.h / 2) - this.y;
         let normalizedIntersectY = relativeIntersectY / (p.h / 2);
         let bounceAngle = normalizedIntersectY * (Math.PI / 4); // Adjust as needed

 // Adjust bounce angle for stability, especially for small angles
 bounceAngle = Math.max(bounceAngle, -Math.PI / 4); // Ensure minimum angle

         // Update speed based on bounce angle
        let speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
        this.xspeed = speed * Math.cos(bounceAngle) + (Math.abs(this.xspeed) / 6); // Always increase speed
        this.yspeed = speed * Math.sin(bounceAngle);


                this.x = p.x + p.w / 2 + this.r;

                if (this.mode === 'alter') {
                    this.hostSocket.emit("HitPaddle");
                    this.guestSocket.emit("HitPaddle");
                }
            }
        }
    }

    checkPaddleRight(paddle: Paddle) {
        const p = paddle.getState();

        const widthScaleFactor = this.width / p.canvasW;
        const heightScaleFactor = this.height / p.canvasH;

        // Update width and height properties
        p.canvasW = this.width;
        p.canvasH = this.height;

        p.w = 14;
        p.h = this.height / 5;

        // Scale the existing coordinates based on the calculated scale factors
        p.x *= widthScaleFactor;
        p.y *= heightScaleFactor;

        // Ensure the paddle stays within canvas bounds after scaling
        p.x = this.constrain(p.x, p.w / 2, p.canvasW - p.w / 2);
        p.y = this.constrain(p.y, p.h / 2, p.canvasH - p.h / 2);

        if (this.y - this.r < p.y + p.h / 2 &&
            this.y + this.r > p.y - p.h / 2 &&
            this.x + this.r > p.x - p.w / 2) {

            if (this.x < p.x) {
                let diff = this.y - (p.y - p.h / 2);
                let angle = this.map(diff, 0, p.h, this.radians(225), this.radians(135));

                // Calculate the new x and y speeds based on the angle
                // this.xspeed = 6 * Math.cos(angle) + this.speed;
                // this.yspeed = 6 * Math.sin(angle) + this.speed;

                // const angleX = this.randomAngle(-Math.PI / 4, Math.PI / 4);
                // const angleY = this.randomAngle(-Math.PI / 4, Math.PI / 4);
                
                // let newX = 6 * Math.cos(angleX);
                // newX = newX > 0 ? -(Math.abs(newX) + this.xspeed) : (Math.abs(newX) + this.xspeed);
                // this.xspeed = newX;

                // this.xspeed = newX;

                // this.yspeed = 6 * Math.cos(angleY);
                // this.yspeed = this.yspeed < 0 ? -Math.abs(this.yspeed) : Math.abs(this.yspeed);

                // Calculate the angle based on the difference in y coordinates
        let relativeIntersectY = (p.y + p.h / 2) - this.y;
        let normalizedIntersectY = relativeIntersectY / (p.h / 2);
        let bounceAngle = normalizedIntersectY * (Math.PI / 4); // Adjust as needed
// Adjust bounce angle for stability, especially for small angles
        bounceAngle = Math.min(bounceAngle, Math.PI / 4); // Ensure maximum angle

        // Update speed based on bounce angle
        let speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
        this.xspeed = -speed * Math.cos(bounceAngle) - (Math.abs(this.xspeed) / 6); // Always increase speed
        this.yspeed = speed * Math.sin(bounceAngle);


                this.x = p.x - p.w / 2 - this.r;

                if (this.mode === 'alter') {
                    this.hostSocket.emit("HitPaddle");
                    this.guestSocket.emit("HitPaddle");
                }
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
            if (this.mode === 'alter') {
                this.hostSocket.emit("WallHit");
                this.guestSocket.emit("WallHit");
            }
        }

        if (this.x - this.r > this.width) {
            this.leftScore++;
            if (this.mode === 'alter') {
                this.hostSocket.emit("OnGoal");
                this.guestSocket.emit("OnGoal");
            }
            this.speed++;
            this.reset();
            return true;
        }

        if (this.x + this.r < 0) {
            this.rightScore++;
            if (this.mode === 'alter') {
                this.hostSocket.emit("OnGoal");
                this.guestSocket.emit("OnGoal");
            }
            this.speed += 2;
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
