// constants.ts

export interface GameConfig {
    windowW: number;
    windowH: number;
    canvasWidth: number;
    canvasHeight: number;
    paddleWidth: number;
    paddleHeight: number;
    ballSizes: {
        large: number;
        medium: number;
        small: number;
        extraSmall: number;
    };
}

export const gameConfig: GameConfig = {
    windowW: 1,
    windowH: 1,
    canvasWidth: 1, // Default values, replace with actual values
    canvasHeight: 1,
    paddleWidth: 14,
    paddleHeight: 1,
    ballSizes: {
        large: 25,
        medium: 20,
        small: 15,
        extraSmall: 10,
    },
};