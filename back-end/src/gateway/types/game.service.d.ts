export interface Ball {
    x: number;
    y: number;
    dx: number; // Delta X - speed and direction on X-axis
    dy: number; // Delta Y - speed and direction on Y-axis
    r: number;
    canvasW: number;
    canvasH: number;
}

export interface Player {
    id: string;
    position: { x: number; y: number }; // Adjusted to include x and y coordinates
}

export interface CanvasConfig {
    windowW: number,
    windowH: number,
    canvasW: number,
    canvasH: number
}

export interface GameState {
    leftScore: number;
    rightScore: number;
    puckCoordinates: { x: number; y: number };
    leftPaddleCoordinates: { x: number; y: number };
    rightPaddleCoordinates: { x: number; y: number };
    ball: Ball; // Add ball property
    players: Player[]; // Add players property
}
