// game.gateway.ts
import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { CreateMatchInput } from 'src/services/dto/create-match.input';
import { MatchService } from 'src/services/match.service';

import { GameState } from './objects/game.class';
import { CanvasConfig } from "./types/game.service";

let width = 1000;
let height = 600;

@WebSocketGateway({ cors: true })
export class GameGateway {
  constructor(private readonly matchService: MatchService) {
  //   this.server.use(new JwtMiddleware().use);
  }
  @WebSocketServer() server: Server;

  private games: Map<string, GameState> = new Map(); // Map to store game instances for each client
  private onlinePlayersQueue: Socket[] = [];


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    if (!client.handshake.query || !client.handshake.query.gameType)
      return;
    // Check if the client wants to play online
    const wantsToPlayOnline = client.handshake.query && client.handshake.query.gameType === 'online';

    if (wantsToPlayOnline) {
      // Create a new game instance for the client
      // const game = new GameState(width, height, 'online');
      // this.games.set(client.id, game);

      // Add the player to the matchmaking queue for online games
      this.onlinePlayersQueue.push(client);
      console.log(`Player ${client.id} is looking for an online game.`);

      // Notify the player that they are waiting for a match
      client.emit('waitingForMatch', { message: 'Waiting for a match...' });

      // Try to create a match if there are enough players in the queue
      // Try to create a match if there are enough players in the queue
      if (this.onlinePlayersQueue.length >= 2) {
        const player1 = this.onlinePlayersQueue.shift()!;
        const player2 = this.onlinePlayersQueue.shift()!;

        // Create a new game instance for the players
        const game = new GameState(width, height, 'online');
        this.games.set(player1.id, game);
        this.games.set(player2.id, game);

        // Initialize paddles and start the game
        game.initLeftPaddle(player1.id);
        game.initRightPaddle(player2.id);

        // Notify players that the match is starting
        player1.emit('matchFound', { message: 'Match found! Starting the game...' });
        player2.emit('matchFound', { message: 'Match found! Starting the game...' });

        // Join the players to a room (you may need to customize room names)
        player1.join(`onlineRoom_${player1.id}${player2.id}`);
        player1.join(`onlineRoom_${player1.id}${player2.id}`);

        const data: CreateMatchInput = {
          host_score_m: 0,
          guest_score_m: 0,
          hostId: '',
          guestId: '',
        }
        this.matchService.createMatch(data);

        // Broadcast the initial game state
        this.broadcastGameState();
      }
    } else {
      // Handle other scenarios, such as offline or AI games
      console.log(`Player ${client.id} connected for other game types.`);


      // Create a new game instance for the client
      const game = new GameState(width, height, `${client.handshake.query.gameType}`);
      this.games.set(client.id, game);

      // Perform necessary setup for offline or AI games
      if (client.handshake.query.gameType === 'offline') {
        game.initLeftPaddle(client.id);
        game.initRightPaddle(client.id);
        this.broadcastGameState();
        client.join('offlineRoom'); // Join an offline room
        console.log(`Player ${client.id} joined the offline room.`);
      } else if (client.handshake.query.gameType === 'ai') {
        game.initLeftPaddle(client.id);
        game.initRightPaddle(client.id);
        this.broadcastGameState();
        client.join('aiRoom'); // Join an AI room
        console.log(`Player ${client.id} joined the AI room.`);
      }
    }
    this.server.emit('connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.games.delete(client.id);
    this.broadcastGameState();
  }

  @SubscribeMessage('updatePaddleScale')
  updatePaddleScale(client: Socket, canvas: CanvasConfig) {
    const game = this.games.get(client.id);
    if (game) {
      game.updatePaddleScale(client.id, canvas);
    }
  }

  @SubscribeMessage('updatePaddleMovement')
  updatePaddleMovement(client: Socket, sideMovement: string) {
    const game = this.games.get(client.id);
    if (game) {
      game.updatePaddleMovement(client.id, sideMovement[0], sideMovement[1]);
    }
  }

  private updateGameState() {
    this.games.forEach((game, clientId) => {
      game.updateGameState();
    });
  }

  private broadcastGameState() {
    this.games.forEach((game, clientId) => {
      game.updateGameState();
      this.server.to(clientId).emit('updateGameState', game.getGameState());

    });
  }

  private startGameLoop() {
    setInterval(() => {
      this.updateGameState();
      this.broadcastGameState();
    }, 1000 / 60); // 60 times per second
  }

  afterInit() {
    this.startGameLoop();
  }
}
