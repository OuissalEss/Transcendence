import { Puck } from './puck.class';
import { Paddle } from './paddle.class';
import { CanvasConfig } from "../types/game.service";

export class GameState {
	private gameEnded: boolean;
	private hostId: string;
	private guestId: string;
	private puck: Puck;
	private leftPaddle: Paddle;
	private rightPaddle: Paddle;
	private readonly width: number;
	private readonly height: number;
	private mode: string

	constructor(width: number, height: number, mode: string) {
		this.width = width;
		this.height = height;
		this.puck = new Puck(width, height);
		this.mode = mode;
		this.gameEnded = false;
	}

	getHostScore() {
		return this.puck.getLeftScore();
	}
	getGuestScore() {
		return this.puck.getRightScore();
	}
	getHostId() {
		return this.hostId;
	}
	getGuestId() {
		return this.guestId;
	}
	getGameEnded() {
		return this.gameEnded;
	}
	setGameEnded(status: boolean) {
		this.gameEnded = status;
	}

	setHostId(hostId: string) {
		this.hostId = hostId;
	}

	setGuestId(guestId: string) {
		this.guestId = guestId;
	}

	getTargetPlayer(playerId: string) {
		if (playerId === this.leftPaddle.getId())
			return this.rightPaddle.getId();
		return this.leftPaddle.getId();
	}
	initLeftPaddle(p1Id: string) {
		this.leftPaddle = new Paddle(p1Id, true, this.width, this.height, this.mode);
	}

	initRightPaddle(p2Id: string) {
		this.rightPaddle = new Paddle(p2Id, false, this.width, this.height, this.mode);
	}

	getMode(): string {
		return this.mode;
	}
	getGameState() {
		let leftPaddleState;
		let rightPaddleState;

		if (this.leftPaddle)
			leftPaddleState = this.leftPaddle.getPaddle();
		if (this.rightPaddle)
			rightPaddleState = this.rightPaddle.getPaddle();
		return {
			leftScore: this.puck.getLeftScore(),
			rightScore: this.puck.getRightScore(),
			Ball: this.puck.getpuck(),
			leftPaddle: leftPaddleState,
			rightPaddle: rightPaddleState,
		}
	}

	updateGameState() {
		this.puck.update();
		this.rightPaddle.update(this.getGameState().Ball);
		this.leftPaddle.update(this.getGameState().Ball);
		if (this.puck.edges()) {
			// reset the paddles
			if (this.leftPaddle)
				this.initLeftPaddle(this.leftPaddle.getPaddle().id);
			if (this.rightPaddle)
				this.initRightPaddle(this.rightPaddle.getPaddle().id);
		}
		if (this.leftPaddle)
			this.puck.checkPaddleLeft(this.leftPaddle);
		if (this.rightPaddle)
			this.puck.checkPaddleRight(this.rightPaddle);
	}

	updatePaddleScale(playerId: string, canvasConfig: CanvasConfig) {
		if (this.leftPaddle.getPaddle().id === playerId) {
			this.leftPaddle.updateScale(canvasConfig);
		} else if (this.rightPaddle.getPaddle().id === playerId) {
			this.rightPaddle.updateScale(canvasConfig);
		}
	}
	updatePaddle(playerId: string, movement: string) {
		if (this.leftPaddle.getPaddle().id === playerId) {
			this.leftPaddle.updateMovement(movement);
		} else if (this.rightPaddle.getPaddle().id === playerId) {
			this.rightPaddle.updateMovement(movement);
		}
	}

	updatePaddleMovement(playerId: string, side: string, movement: string) {
		if (side === 'L' && this.leftPaddle.getPaddle().id == playerId && this.mode === 'online') {
			this.leftPaddle.updateMovement(movement);
		} else if (side === 'L' && this.rightPaddle.getPaddle().id == playerId && this.mode === 'online') {
			this.rightPaddle.updateMovement(movement);
		} else if (side == 'R' && this.mode == "offline") {
			this.leftPaddle.updateMovement(movement);
		} else if (side == 'L' && this.mode == 'offline') {
			this.rightPaddle.updateMovement(movement);
		} else if (side == 'L' && this.mode == "ai") {
			this.leftPaddle.updateMovement(movement);
		} else if (side == 'R' && this.mode == 'ai') {
			this.rightPaddle.updateMovement(movement);
		}
	}
}
