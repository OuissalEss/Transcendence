'use client'
import React, { useEffect, useState } from 'react';
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { gameConfig } from './constants';

import {Paddle} from './objects/paddle';
import {Puck} from './objects/puck';
import { Socket, io } from 'socket.io-client';
import Player from '@/app/components/Player/Player';
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { oPaddle } from './objects/opaddle';
import User from '@/app/types/user-interace';

let op = {
  x: gameConfig.canvasWidth / 2,
  y: gameConfig.canvasHeight / 2,
      
  w: gameConfig.paddleWidth,
  h: gameConfig.canvasHeight / 5,
      
  width: gameConfig.canvasWidth,
  height: gameConfig.canvasHeight,

  speed: 5,
  isLeft: true,
  ychange: 0,
}

function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketIo = io(url, { reconnection: true, query: { gameType: 'online' }},)

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup
  }, [])

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
  let paddleLeft: Paddle;
  let paddleRight: Paddle;
  let opaddle: oPaddle;
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
    opaddle = new oPaddle(p5, op);
    opaddleR = new oPaddle(p5, op);
    paddleLeft = new Paddle(p5, true);
    paddleRight = new Paddle(p5, false);
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

    paddleLeft.update(socket);
    // paddleLeft.show();

    paddleRight.update(socket);
    // paddleRight.show();

    socket.on('updateGameState', (gameState: { leftPaddle: { x: number; y: number; w: number; h: number; canvasW: number; canvasH: number; }; Ball: any; leftScore: any; rightScore: any; }) => {
      op.x = gameState.leftPaddle.x;
      op.y = gameState.leftPaddle.y;
      op.w = gameState.leftPaddle.w;
      op.h = gameState.leftPaddle.h;
      op.width = gameState.leftPaddle.canvasW;
      op.height = gameState.leftPaddle.canvasH;
      puck.ballUpdate(gameState.Ball, gameConfig.canvasWidth, gameConfig.canvasHeight);
      updateScores(gameState.leftScore, gameState.rightScore);
    });

    opaddle.update(op);
    opaddle.show()
    puck.show();
  };
};




const Pong = () => {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [userData, setUserData] = useState<User>();
  const [isLoading, setLoading] = useState(true)

  const updateScores = (newLeftScore: number, newRightScore: number) => {
    setLeftScore(newLeftScore);
    setRightScore(newRightScore);
  };


  const socket = useSocket('http://127.0.0.1:3000')

  useEffect(() => {
    const token = getCookie('token');
    const decodedToken = jwt.decode(token ? token : "");

    fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify({
            query: `{ getUserById(id: "${decodedToken ? decodedToken.sub : ""}") {
                      id
                      email
                      username
                      connection {
                        provider
                        is2faEnabled
                      }
        }}`,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        next: { revalidate: 10 },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch toilet data in a city');
      }
      return res.json()
    }).then((data) => {
      setUserData(data.data['getUserById']);
      setLoading(false);
    });
    function handleEvent(payload: any) {
      console.log(payload) 
    }
    if (socket) {
      socket.on('connected', handleEvent)
    }
  }, [socket]);

  if (isLoading) return <p>Loading...</p>
  if (!userData) return <p>No profile data</p>

  return (
    <div className="game">
      <Player username={userData.username} leftScore={leftScore} rightScore={rightScore} />
      <div className="board-container">
        <div id="canvas-container" className="canvas-container">
          <NextReactP5Wrapper sketch={(p5) => sketch(p5, socket, updateScores)} />
        </div>
      </div>
    </div>
  );
};

export default Pong;