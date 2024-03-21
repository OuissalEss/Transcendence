'use client'
import { useEffect, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { gameConfig } from './constants';
import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";

import { Puck } from './objects/puck';
import { Socket, io } from 'socket.io-client';
import Player from '../../../components/Player';
//import { getCookie } from 'cookies-next';
//import jwt from 'jsonwebtoken';
import { oPaddle } from './objects/opaddle';
import User from "../../../types/user-interfac";
import DashboardLayout from '../../../layouts/LayoutDefault';
import "../../../assets/game.css"

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

function useSocket(url: string, gameType: string) {
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socketIo = io(url, { reconnection: false, query: { gameType } },)

        setSocket(socketIo)

        function cleanup() {
            socketIo.disconnect()
        }
        return cleanup
    }, [gameType, url])

    return socket
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

const sketch = (p5: any, socket: any, updateScores: any) => {
    let puck: Puck;
    // let paddleLeft: Paddle;
    // let paddleRight: Paddle;
    let opaddleL: oPaddle;
    let opaddleR: oPaddle;

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
        console.log(gameConfig.windowH, gameConfig.windowW);
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
            puck.ballUpdate(gameState.Ball, gameConfig.canvasWidth, gameConfig.canvasHeight);
            updateScores(gameState.leftScore, gameState.rightScore);
        });

        opaddleL.update(opL);
        opaddleL.show()

        opaddleR.update(opR);
        opaddleR.show();

        puck.show();
    };
};




const Pong = () => {
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [userData, setUserData] = useState<User>();
    const [isLoading, setLoading] = useState(true)

    const urlParams = new URLSearchParams(window.location.search);
    console.log("params = ", urlParams.get('mode'));

    let mode = urlParams.get('mode');
    if (mode != "online" && mode != "offline" && mode != "ai"){
        mode = "400";
    }
    console.log("MODE = ", mode);

    const updateScores = (newLeftScore: number, newRightScore: number) => {
        setLeftScore(newLeftScore);
        setRightScore(newRightScore);
    };

    const socket = useSocket('http://127.0.0.1:3000', mode);

    useEffect(() => {
//        const token = getCookie('token');
//        const decodedToken = jwt.decode(token ? token : "");
//
//        fetch('http://localhost:3000/graphql', {
//            method: 'POST',
//            body: JSON.stringify({
//                query: `{ getUserById(id: "${decodedToken ? decodedToken.sub : ""}") {
//                      id
//                      email
//                      username
//                      connection {
//                        provider
//                        is2faEnabled
//                      }
//        }}`,
//            }),
//            headers: {
//                'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
//            },
//            next: { revalidate: 10 },
//        }).then((res) => {
//            if (!res.ok) {
//                throw new Error('Failed to fetch toilet data in a city');
//            }
//            return res.json()
//        }).then((data) => {
//            setUserData(data.data['getUserById']);
//            setLoading(false);
//        });
        function handleEvent(payload: any) {
            console.log(payload)
        }
        if (socket) {
            socket.on('connected', handleEvent)
        }
    }, [socket]);

    // if (isLoading) return <p>Loading...</p>
    // if (!userData) return <p>No profile data</p>

    return (
        <DashboardLayout>
            <div className="game-modes">
                <Player username='test' leftScore={leftScore} rightScore={rightScore} />
                <div className="board-container">
                    <div id="canvas-container" className="canvas-container">
                        <ReactP5Wrapper sketch={(p5) => sketch(p5, socket, updateScores)} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
        );
};

export default Pong;