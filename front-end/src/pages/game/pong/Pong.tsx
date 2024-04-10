'use client'
import { useContext, useEffect, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { gameConfig } from './constants';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

import { Puck } from './objects/puck';
import { Socket, io } from 'socket.io-client';
import Player from '../../../components/Player';

import { oPaddle } from './objects/opaddle';
import User from "../../../types/user-interface";
import "../../../assets/game.css"
import { useSocket } from '../../../App';
import GameLoading from '../../../components/GameLoading';
import { useAuth } from '../../../provider/authProvider';
import GameEnded from '../../../components/GameEnded';
import AlreadyInGame from '../../../components/AlreadyInGame';



const opL = {
	x: gameConfig.canvasWidth / 2,
	y: gameConfig.canvasHeight / 2,

	w: gameConfig.paddleWidth,
	h: gameConfig.canvasHeight / 5,

	width: gameConfig.canvasWidth,
	height: gameConfig.canvasHeight,

	speed: 5,
	ychange: 0,
}

const opR = {
	x: gameConfig.canvasWidth / 2,
	y: gameConfig.canvasHeight / 2,

	w: gameConfig.paddleWidth,
	h: gameConfig.canvasHeight / 5,

	width: gameConfig.canvasWidth,
	height: gameConfig.canvasHeight,

	speed: 5,
	ychange: 0,
}


const calculatCanvasSize = () => {
	if (gameConfig.windowW >= 1300) {
		gameConfig.canvasWidth = 1000;
		gameConfig.canvasHeight = 600;
	} else if (gameConfig.windowW < 1300 && gameConfig.windowW >= 992) {
		gameConfig.canvasWidth = 750;
		gameConfig.canvasHeight = 400;
	} else if (gameConfig.windowW < 992 && gameConfig.windowW >= 768) {
		gameConfig.canvasWidth = 600;
		gameConfig.canvasHeight = 300;
	} else if (gameConfig.windowW < 768) {
		gameConfig.canvasWidth = 260;
		gameConfig.canvasHeight = 140;
	}
};

const sketch = (p5: any, socket: any, updateScores: any, mode) => {
	let puck: Puck;
	// let paddleLeft: Paddle;
	// let paddleRight: Paddle;
	let opaddleL: oPaddle;
	let opaddleR: oPaddle;
	let leftScore: number;
	let rightScore: number;

	// Initiate Window Configurations
	gameConfig.windowW = window.innerWidth;
	gameConfig.windowH = window.innerWidth;

	p5.setup = () => {


		// Calculate Canvas Size
		calculatCanvasSize();

		const canvas = p5.createCanvas(gameConfig.canvasWidth, gameConfig.canvasHeight);

		canvas.parent('canvas-container');

		puck = new Puck(p5);
		opaddleL = new oPaddle(p5, opL, true, socket);
		opaddleR = new oPaddle(p5, opR, false, socket);
		leftScore = 0;
		rightScore = 0;
	};

	p5.windowResized = () => {
		gameConfig.windowW = window.innerWidth;
		gameConfig.windowH = window.innerWidth;

		calculatCanvasSize();

		socket.emit('updatePaddleScale', {
			'windowW': gameConfig.windowW,
			'windowH': gameConfig.windowH,
			'canvasW': gameConfig.canvasWidth,
			'canvasH': gameConfig.canvasHeight,
		});

		p5.resizeCanvas(gameConfig.canvasWidth, gameConfig.canvasHeight);
	};

	p5.draw = () => {
		p5.clear();


		p5.stroke(255);
		p5.strokeWeight(2);
		p5.stroke(255, 255, 255, 100);
		p5.drawingContext.setLineDash([15, 10]);
		p5.strokeWeight(3);
		p5.line(gameConfig.canvasWidth / 2, 0, gameConfig.canvasWidth / 2, gameConfig.canvasHeight);

		p5.stroke(255, 255, 255, 200);
		p5.strokeWeight(6);

		p5.drawingContext.setLineDash([]);

		p5.line(gameConfig.canvasWidth, 0, gameConfig.canvasWidth, gameConfig.canvasHeight);
		p5.line(0, gameConfig.canvasWidth, 0, 0);
		p5.line(0, 0, gameConfig.canvasWidth, 0);
		p5.line(0, gameConfig.canvasHeight, gameConfig.canvasWidth, gameConfig.canvasHeight);

		p5.strokeWeight();


		socket.on('updateGameState', (gameState: { leftPaddle: { x: number; y: number; w: number; h: number; speed: number; canvasW: number; canvasH: number; }; rightPaddle: { x: number; y: number; w: number; h: number; speed: number; canvasW: number; canvasH: number; }; Ball: any; leftScore: any; rightScore: any; }) => {
			opL.x = gameState.leftPaddle.x;
			opL.y = gameState.leftPaddle.y;
			opL.w = gameState.leftPaddle.w;
			opL.h = gameState.leftPaddle.h;
			opL.speed = gameState.leftPaddle.speed;
			opL.width = gameState.leftPaddle.canvasW;
			opL.height = gameState.leftPaddle.canvasH;
			opR.x = gameState.rightPaddle.x;
			opR.y = gameState.rightPaddle.y;
			opR.w = gameState.rightPaddle.w;
			opR.h = gameState.rightPaddle.h;
			opR.speed = gameState.rightPaddle.speed;
			opR.width = gameState.rightPaddle.canvasW;
			opR.height = gameState.rightPaddle.canvasH;
			// if (leftScore != gameState.leftScore || rightScore != gameState.rightScore) {
			// 	audio.loop = false;
			// 	audio.play();
			// }
			puck.ballUpdate(gameState.Ball, gameConfig.canvasWidth, gameConfig.canvasHeight);
			updateScores(gameState.leftScore, gameState.rightScore);
			leftScore = gameState.leftScore;
			rightScore = gameState.rightScore;
		});

		opaddleL.update(opL);
		opaddleL.show()

		opaddleR.update(opR);
		opaddleR.show();

		puck.show();
	};
};


interface GameData {
	p2Id: string,
	p2Username: string,
	p2Image: string,
	p2Character: string,
	p2Host: boolean,
}

interface FinishedGameData {
	Id: string,
	Username: string,
	Image: string,
	Character: string,
	Host: boolean,
	HostScore: number,
	GuestScore: number,
}

import ringer from '/Sounds/ding.mp3';
import hit from '/Sounds/hit.mp3';
import Wall from '/Sounds/wallHit.mp3';

import { left } from '@cloudinary/url-gen/qualifiers/textAlignment';

const audio = new Audio(ringer);
const BallHit = new Audio(hit);
const wallHit = new Audio(Wall);

const Pong = () => {
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const { socket } = useSocket();
	const [gameIsLive, setGameLive] = useState(true);
	const [oppUsername, setOppUsername] = useState();
	const [oppImage, setOppImage] = useState();
	const [oppId, setOppId] = useState();
	const [gameData, setGameData] = useState<GameData | null>(null);
	const [finishedGameData, setFinishedGameData] = useState<FinishedGameData | null>(null);
	const [alreadyInGame, setAlreadyInGame] = useState(false);

	const urlParams = new URLSearchParams(window.location.search);
	let mode = urlParams.get('mode');

	if (!["online", "offline", "ai", "alter"].includes(mode)) {
		mode = "400";
	}



	useEffect(() => {
		if (!socket) return;

		socket.emit('startMatch', mode);

		socket.on("OnGoal", () => {
			audio.loop = false;
			audio.play();
		});

		socket.on("HitPaddle", () => {
			BallHit.loop = false;
			BallHit.play();
		})

		socket.on("WallHit", () => {
			wallHit.loop = false;
			wallHit.play();
		})

		socket.on("matchStatus", (status: boolean) => {
			if (!status.matchStatus)
				setLoading(true);
			else
				setLoading(false);
		})

		socket.on('onTargetDisconnect', () => {
			// Opponenet disconnected you won
			setGameLive(false);
		});

		socket.on('alreadyWaiting', () => {
			setAlreadyInGame(true);
		})

		socket.on('gameFinished', ({ userId, username, image, character, host, hostScore, guestScore }: { userId: string, username: string, image: string, character: string, host: boolean, hostScore: number, guestScore: number }) => {
			// Game Finished
			let data: FinishedGameData = {
				Id: userId,
				Username: username,
				Image: image,
				Character: character,
				Host: host,
				HostScore: hostScore,
				GuestScore: guestScore,
			}
			setFinishedGameData(data);
			setGameLive(false);
		});
		socket.on('oppenentData', ({ userId, username, image, character, host }: { userId: string, username: string, image: string, character: string, host: boolean }) => {

			let data: GameData = {
				p2Id: userId,
				p2Username: username,
				p2Image: image,
				p2Character: character,
				p2Host: host,
			}
			setGameData(data);
		})
		return () => {
			// Clean up socket listeners if component unmounts
			socket.emit('endMatch')
		};
	}, [socket]);

	const updateScores = (newLeftScore: number, newRightScore: number) => {
		setLeftScore(newLeftScore);
		setRightScore(newRightScore);
	};


	if (!socket) {
		return (
			<div>Socket not connected</div>
		);
	}

	if (isLoading)
		return <GameLoading />

	if (!gameIsLive)
		return <GameEnded gameMode={mode} gameData={finishedGameData} leftScore={leftScore} rightScore={rightScore} />
	if (alreadyInGame)
		return <AlreadyInGame />
	return (
		<div className="game-modes">
			<Player gameMode={mode} gameData={gameData} leftScore={leftScore} rightScore={rightScore} />
			<div className="board-container">
				<div id="canvas-container" className="canvas-container">
					<ReactP5Wrapper sketch={(p5) => sketch(p5, socket, updateScores, mode)} />
				</div>
			</div>
		</div>
	);
};

export default Pong;