import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "src/auth/constants";
import { MatchService } from 'src/services/match.service';
import { GameState } from './objects/game.class';
import { CanvasConfig } from "./types/game.service";
import { UserService } from '../services/user.service';
import { CreateMatchInput } from 'src/services/dto/create-match.input';
import { PrismaService } from 'src/services/prisma.service';
import { create } from 'domain';
import { Achievement, Character, NotifType } from '@prisma/client';
import { CreateFriendInput } from 'src/services/dto/create-friend.input';
import { FriendService } from 'src/services/friend.service';
import { Friend } from 'src/entities/friend.entity';
import { AchievementService } from 'src/services/user_achievement.service';
import { Match } from "src/entities/match.entity";
import { isRFC3339 } from 'class-validator';
import { CreateNotificationInput } from 'src/services/dto/create-notification.input';
import { NotificationService } from 'src/services/notification.service';

// Define a type for player information
interface PlayerInfo {
	playerId: string;
	userId: string;
	username: string;
	image: string;
	character: Character;
	playerSocket: Socket;
}

// Define a type for room data
interface RoomData {
	roomId: string;
	players: string[]; // Array to store player IDs
}

let width = 1000;
let height = 600;

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly matchService: MatchService,
		private readonly userService: UserService,
		private readonly achievementService: AchievementService,
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
		private readonly friendService: FriendService,
		private readonly notificationService: NotificationService,
	) {
	}

	@WebSocketServer() server: Server;
	private games: Map<GameState, { hostId: string, guestId: string }> = new Map(); // Map to store game instances for each client
	private onlinePlayersQueue: Socket[] = [];
	private invitePlayersQueue: { inviteCode: string, socket: Socket }[] = [];
	private inviteGame: Map<string, { senderSocket: Socket, senderId: string, isSenderWaiting: boolean, receiverId: string, receiverSocket: Socket, isReceiverWaiting: boolean }> = new Map();
	private alterPlayersQueue: Socket[] = [];
	private playerInfoMap: Map<string, PlayerInfo> = new Map(); // Map to store player info
	private activeRooms: Map<string, RoomData> = new Map(); // Map to store active room data

	// Method to handle client connection
	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	// Method to handle client disconnection
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);

		// Cleanup resources related to the disconnected client
		this.cleanupDisconnectedClient(client);
	}

	private findGame(clientId: string): GameState | null {
		let game: GameState | null = null;

		this.games.forEach((value, key) => {
			if (value.hostId == clientId || value.guestId === clientId)
				game = key;
		})

		return game;
	}

	private countMatchesWithOpponent(matches: Match[], playerId: string, opponentId: string) {
		let matchCount = 0;
		matches.forEach(match => {
			if ((match.guest.id === playerId && match.host.id === opponentId) ||
				(match.host.id === playerId && match.guest.id === opponentId)) { matchCount++; }
		});
		return matchCount;
	}

	// Method to clean up resources of disconnected client
	private async cleanupDisconnectedClient(client) {
		const clientId = client.id;

		// Check if player is on waitlist
		if (this.onlinePlayersQueue.includes(client)) {
			// Remove player from onlinePlayersQueue
			this.onlinePlayersQueue = this.onlinePlayersQueue.filter(socket => socket.id !== clientId);
		}

		const game: GameState | null = this.findGame(clientId);

		// Handle if the client is on Match
		if (game) {
			const clientInfo = this.games.get(game);

			const guesId = clientInfo.guestId;
			const hostId = clientInfo.hostId;

			this.server.to(hostId).emit('gameFinished', {
				userId: this.playerInfoMap.get(game.getGuestId())?.userId,
				username: this.playerInfoMap.get(game.getGuestId())?.username,
				image: this.playerInfoMap.get(game.getGuestId())?.image,
				character: this.playerInfoMap.get(game.getGuestId())?.character,
				host: true,
				hostScore: game.getHostScore(),
				guestScore: game.getGuestScore(),
			});
			this.server.to(guesId).emit('gameFinished', {
				userId: this.playerInfoMap.get(game.getHostId())?.userId,
				username: this.playerInfoMap.get(game.getHostId())?.username,
				image: this.playerInfoMap.get(game.getHostId())?.image,
				character: this.playerInfoMap.get(game.getHostId())?.character,
				host: false,
				hostScore: game.getHostScore(),
				guestScore: game.getGuestScore(),
			});

			await this.userService.updateStatus(this.playerInfoMap.get(game.getHostId())?.userId, "ONLINE");
			await this.userService.updateStatus(this.playerInfoMap.get(game.getGuestId())?.userId, "ONLINE");

			// Disconnect the players and create match on Database
			// Forfient Client

			// Handle if online to disconnect the Oppenent
			if (game.getMode() === "online" || game.getMode() === 'alter' || 'invite') {
				// Disconnect the Opponenet from the game
				const oppSocket = this.playerInfoMap.get(guesId);

				if (oppSocket) {
					oppSocket?.playerSocket.emit('onTargetDisconnect');
				}


				// Create match in database
				if (game.getGuestScore() == game.getHostScore()) {
					const match = await this.prismaService.match.create({
						data: {
							guest_score_m: game.getGuestScore(),
							host_score_m: game.getHostScore(),
							hostId: this.playerInfoMap.get(hostId)?.userId,
							guestId: this.playerInfoMap.get(guesId)?.userId,
						}
					})
					this.userService.addXp(this.playerInfoMap.get(hostId)?.userId, 250);
					this.userService.addXp(this.playerInfoMap.get(guesId)?.userId, 250);
				} else {
					let winner = '';
					let loser = '';
					if (game.getGuestScore() > game.getHostScore()) {
						winner = this.playerInfoMap.get(guesId)?.userId;
						loser = this.playerInfoMap.get(hostId)?.userId;
					} else if (game.getHostScore() > game.getGuestScore()) {
						winner = this.playerInfoMap.get(hostId)?.userId;
						loser = this.playerInfoMap.get(guesId)?.userId;
					}
					const match = await this.prismaService.match.create({
						data: {
							guest_score_m: game.getGuestScore(),
							host_score_m: game.getHostScore(),
							hostId: this.playerInfoMap.get(hostId)?.userId,
							guestId: this.playerInfoMap.get(guesId)?.userId,
							winnerId: winner,
							loserId: loser,
						}
					})
					this.userService.addXp(winner, 500);
				}
				const host = await this.userService.getUserById(this.playerInfoMap.get(hostId)?.userId);
				if (host.winner.length == 5) {
					this.achievementService.createAchievement(host.id, "winning");
				}
				const guest = await this.userService.getUserById(this.playerInfoMap.get(guesId)?.userId);
				if (guest.winner.length == 5) {
					this.achievementService.createAchievement(guest.id, "winning");
				}
				const hostmatches = await this.matchService.getAllUserMatchs(host.id);
				const opponentsCount = this.countMatchesWithOpponent(hostmatches, host.id, guest.id);
				if (opponentsCount == 3) {
					this.achievementService.createAchievement(host.id, "loyal");
					this.achievementService.createAchievement(guest.id, "loyal");
				}
			}

			this.games.delete(game);

			if (game.getMode() === 'invite') {
				let inviteCode = null;

				this.inviteGame.forEach((value, key) => {
					if (value.receiverSocket == client || value.senderSocket == client)
						inviteCode = key;
				});
				if (inviteCode != null)
					this.inviteGame.delete(inviteCode);
			}
		}
		// Remove player from playerInfoMap
		this.playerInfoMap.delete(clientId);
	}

	private async updateAndBroadcastGameState() {
		this.games.forEach(async (clientStats, game) => {
			const hostId = clientStats.hostId;
			const guestId = clientStats.guestId;

			if ((game.getHostScore() === 3 || game.getGuestScore() === 3) && !game.getGameEnded() && (game.getMode() === 'online' || game.getMode() === 'alter' || game.getMode() === 'invite')) {
				console.log("Game Ended");
				// Emit 'gameFinished' event to the client associated with this game

				// Emit 'gameFinished' event to the client associated with this game
				this.server.to(hostId).emit('gameFinished', {
					userId: this.playerInfoMap.get(game.getGuestId()).userId,
					username: this.playerInfoMap.get(game.getGuestId()).username,
					image: this.playerInfoMap.get(game.getGuestId()).image,
					character: this.playerInfoMap.get(game.getGuestId()).character,
					host: true,
					hostScore: game.getHostScore(),
					guestScore: game.getGuestScore(),
				});
				this.server.to(guestId).emit('gameFinished', {
					userId: this.playerInfoMap.get(game.getHostId()).userId,
					username: this.playerInfoMap.get(game.getHostId()).username,
					image: this.playerInfoMap.get(game.getHostId()).image,
					character: this.playerInfoMap.get(game.getHostId()).character,
					host: false,
					hostScore: game.getHostScore(),
					guestScore: game.getGuestScore(),
				});
				await this.userService.updateStatus(this.playerInfoMap.get(game.getHostId()).userId, "ONLINE");
				await this.userService.updateStatus(this.playerInfoMap.get(game.getGuestId()).userId, "ONLINE");

				// if (clientId == game.getHostId() && !game.getGameEnded())
				this.handleFinishedGame(game);
				game.setGameEnded(true);
			} else if ((game.getHostScore() === 3 || game.getGuestScore() === 3) && !game.getGameEnded() && game.getMode() != 'online' && game.getMode() != 'alter' && game.getMode() != 'invite') {
				console.log("Game Ended");

				this.server.to(hostId).emit('gameFinished', {
					userId: this.playerInfoMap.get(game.getGuestId()).userId,
					username: this.playerInfoMap.get(game.getGuestId()).username,
					image: this.playerInfoMap.get(game.getGuestId()).image,
					character: this.playerInfoMap.get(game.getGuestId()).character,
					host: true,
					hostScore: game.getHostScore(),
					guestScore: game.getGuestScore(),
				});
				await this.userService.updateStatus(this.playerInfoMap.get(game.getHostId()).userId, "ONLINE");
				await this.userService.updateStatus(this.playerInfoMap.get(game.getGuestId()).userId, "ONLINE");

				this.handleFinishedGame(game);

				game.setGameEnded(true);
			} else {
				game.updateGameState();
				const gameStats = game.getGameState();
				// If the game is still ongoing, emit the updated game state
				this.server.to(hostId).emit('updateGameState', gameStats);
				if (game.getMode() === 'online' || game.getMode() === 'alter' || game.getMode() === 'invite')
					this.server.to(guestId).emit('updateGameState', gameStats);

			}
		});
	}

	// Method to handle actions after a game finishes
	private async handleFinishedGame(game: GameState) {
		if (game.getMode() == 'online' || game.getMode() === 'alter' || game.getMode() === 'invite') {
			if (game.getGuestScore() == game.getHostScore()) {
				const match = await this.prismaService.match.create({
					data: {
						guest_score_m: game.getGuestScore(),
						host_score_m: game.getHostScore(),
						hostId: this.playerInfoMap.get(game.getHostId()).userId,
						guestId: this.playerInfoMap.get(game.getGuestId()).userId,
					}
				});
				this.userService.addXp(this.playerInfoMap.get(game.getHostId()).userId, 250);
				this.userService.addXp(this.playerInfoMap.get(game.getGuestId()).userId, 250);
			} else {
				let winner = '';
				let loser = '';
				if (game.getGuestScore() > game.getHostScore()) {
					winner = this.playerInfoMap.get(game.getGuestId()).userId;
					loser = this.playerInfoMap.get(game.getHostId()).userId;
				} else if (game.getHostScore() > game.getGuestScore()) {
					winner = this.playerInfoMap.get(game.getHostId()).userId;
					loser = this.playerInfoMap.get(game.getGuestId()).userId;
				}
				const match = await this.prismaService.match.create({
					data: {
						guest_score_m: game.getGuestScore(),
						host_score_m: game.getHostScore(),
						hostId: this.playerInfoMap.get(game.getHostId()).userId,
						guestId: this.playerInfoMap.get(game.getGuestId()).userId,
						winnerId: winner,
						loserId: loser,
					}
				});
				this.userService.addXp(winner, 500);
			}
			const host = await this.userService.getUserById(this.playerInfoMap.get(game.getHostId()).userId);
			if (host.winner.length == 5) {
				this.achievementService.createAchievement(host.id, "winning");
			}
			const guest = await this.userService.getUserById(this.playerInfoMap.get(game.getGuestId()).userId);
			if (guest.winner.length == 5) {
				this.achievementService.createAchievement(guest.id, "winning");
			}
			const hostmatches = await this.matchService.getAllUserMatchs(host.id);
			const opponentsCount = this.countMatchesWithOpponent(hostmatches, host.id, guest.id);
			if (opponentsCount == 3) {
				this.achievementService.createAchievement(host.id, "loyal");
				this.achievementService.createAchievement(guest.id, "loyal");
			}
		}
		this.games.delete(game);
		if (game.getMode() === 'invite') {
			let inviteCode = null;

			const host = this.playerInfoMap.get(game.getHostId());

			if (host) {
				const clientSocket = host.playerSocket;
				this.inviteGame.forEach((value, key) => {
					if (value.receiverSocket == clientSocket || value.senderSocket == clientSocket)
						inviteCode = key;
				});
			}

			if (inviteCode != null)
				this.inviteGame.delete(inviteCode);
		}
	}

	// Middleware to handle JWT authentication
	afterInit() {
		this.startGameLoop(); // Start the game loop in the constructor
		this.server.use(async (socket: Socket, next) => {
			const token = socket.handshake.headers.authorization?.split(' ')[1];
			if (!token) {
				return next(new Error("Empty Token!"));
			}

			try {
				const userPayload = await this.jwtService.verifyAsync(token, {
					secret: jwtConstants.secret,
				});

				const user = await this.userService.getUserById(userPayload.sub);

				if (!user) {
					return next(new Error("Invalid Token!"));
				}

				const playerData: PlayerInfo = {
					playerId: socket.id,
					userId: user.id,
					username: user.username,
					image: user.avatar.filename,
					character: user.character,
					playerSocket: socket
				};

				this.playerInfoMap.set(socket.id, playerData);

				next();
			} catch (error) {
				next(new Error("Invalid Token!"));
			}
		});
	}

	// Handler for starting a match
	@SubscribeMessage('endMatch')
	async endMatch(client: Socket) {
		// On exit the game disconnect the players from the match
		// then create the match in the db
		console.log(`End Game ${client.id}`)

		const clientId = client.id;
		// Remove player from onlinePlayersQueue
		this.onlinePlayersQueue = this.onlinePlayersQueue.filter(socket => socket.id !== clientId);

		const game = this.findGame(clientId);
		if (game) {
			console.log("HERE");
			const clientStats = this.games.get(game);
			const guestId = clientStats.guestId;
			const hostId = clientStats.hostId;

			console.log("SEND HOST", hostId)
			this.server.to(hostId).emit('gameFinished', {
				userId: this.playerInfoMap.get(game.getGuestId()).userId,
				username: this.playerInfoMap.get(game.getGuestId()).username,
				image: this.playerInfoMap.get(game.getGuestId()).image,
				character: this.playerInfoMap.get(game.getGuestId()).character,
				host: true,
				hostScore: game.getHostScore(),
				guestScore: game.getGuestScore(),
			});
			console.log("SEND", guestId)
			this.server.to(guestId).emit('gameFinished', {
				userId: this.playerInfoMap.get(game.getHostId()).userId,
				username: this.playerInfoMap.get(game.getHostId()).username,
				image: this.playerInfoMap.get(game.getHostId()).image,
				character: this.playerInfoMap.get(game.getHostId()).character,
				host: false,
				hostScore: game.getHostScore(),
				guestScore: game.getGuestScore(),
			});

			await this.userService.updateStatus(this.playerInfoMap.get(game.getHostId()).userId, "ONLINE");
			await this.userService.updateStatus(this.playerInfoMap.get(game.getGuestId()).userId, "ONLINE");

			if (game.getMode() == 'online' || game.getMode() == 'alter' || game.getMode() == 'invite') {
				// Create match in database
				if (game.getGuestScore() == game.getHostScore()) {
					const match = await this.prismaService.match.create({
						data: {
							guest_score_m: game.getGuestScore(),
							host_score_m: game.getHostScore(),
							hostId: this.playerInfoMap.get(hostId)?.userId,
							guestId: this.playerInfoMap.get(guestId)?.userId,
						}
					});
					this.userService.addXp(this.playerInfoMap.get(hostId)?.userId, 250);
					this.userService.addXp(this.playerInfoMap.get(guestId)?.userId, 250);
				} else {
					let winner = '';
					let loser = '';
					if (game.getGuestScore() > game.getHostScore()) {
						winner = this.playerInfoMap.get(guestId)?.userId;
						loser = this.playerInfoMap.get(hostId)?.userId;
					} else if (game.getHostScore() > game.getGuestScore()) {
						winner = this.playerInfoMap.get(hostId)?.userId;
						loser = this.playerInfoMap.get(guestId)?.userId;
					}
					const match = await this.prismaService.match.create({
						data: {
							guest_score_m: game.getGuestScore(),
							host_score_m: game.getHostScore(),
							hostId: this.playerInfoMap.get(hostId)?.userId,
							guestId: this.playerInfoMap.get(guestId)?.userId,
							winnerId: winner,
							loserId: loser,
						}
					})
					this.userService.addXp(winner, 500);
				}
				const host = await this.userService.getUserById(this.playerInfoMap.get(hostId)?.userId);
				if (host.winner.length == 5) {
					this.achievementService.createAchievement(host.id, "winning");
				}
				const guest = await this.userService.getUserById(this.playerInfoMap.get(guestId)?.userId);
				if (guest.winner.length == 5) {
					this.achievementService.createAchievement(guest.id, "winning");
				}
				const hostmatches = await this.matchService.getAllUserMatchs(host.id);
				const opponentsCount = this.countMatchesWithOpponent(hostmatches, host.id, guest.id);
				if (opponentsCount == 3) {
					this.achievementService.createAchievement(host.id, "loyal");
					this.achievementService.createAchievement(guest.id, "loyal");
				}
			}

			// To-Do: Disconnect Players and remove them from game list
			const opp: PlayerInfo = this.playerInfoMap.get(guestId);

			opp.playerSocket.emit('onTargetDisconnect');

			this.games.delete(game);
		}
		let inviteCode = null;

		this.inviteGame.forEach((value, key) => {
			if (value.receiverSocket == client || value.senderSocket == client)
				inviteCode = key;
		});
		if (inviteCode != null)
			this.inviteGame.delete(inviteCode);
	}

	// Handler for starting a match
	@SubscribeMessage('startMatch')
	startMatch(client: Socket, data: { mode: string, inviteCode: string }) {

		const mode = data[0];
		const inviteCode = data[1];
		console.log(mode, inviteCode);
		const userInfo = this.playerInfoMap.get(client.id);

		if (userInfo) {
			const userId = userInfo.userId;

			for (const [playerId, playerInfo] of this.playerInfoMap) {
				if (playerInfo.userId === userId) {
					const game: GameState | null = this.findGame(playerId);
					if (game) {
						console.log(`Player ${client.id} is already in a game.`);
						client.emit('alreadyWaiting');
						return;
					}

					if ((mode === 'online' || mode === 'alter') && this.onlinePlayersQueue.some(socket => socket.id === playerId)) {
						console.log(`Player ${client.id} is already waiting for an online game.`);
						client.emit('alreadyWaiting');
						return;
					}

					let isInvite = false;
					this.inviteGame.forEach((value, key) => {
						if ((value.senderId === userInfo.userId && value.isSenderWaiting) || (value.receiverId === userInfo.userId && value.isReceiverWaiting)) {
							isInvite = true;
							return;
						}
					});

					if (isInvite) {
						console.log(`Player ${client.id} is already waiting for an invite game.`);
						client.emit('alreadyWaiting');
						return;
					}
				}
			}
		}
		const gameInfo: GameState | null = this.findGame(client.id);
		// Check if the player is already in a game
		if (gameInfo) {
			console.log(`Player ${client.id} is already in a game.`);
			client.emit('alreadyInGame', { message: 'You are already in a game.' });
			return;
		}

		// Check if the player is already waiting for an online game
		if ((mode === 'online' || mode === 'alter') && this.onlinePlayersQueue.includes(client)) {
			console.log(`Player ${client.id} is already waiting for an online game.`);
			client.emit('alreadyWaiting', { message: 'You are already waiting for an online game.' });
			return;
		}

		if (mode === 'online') {
			this.handleOnlineMatch(client);
		} else if (mode === 'invite' && inviteCode) {
			this.handleInviteMatch(client, inviteCode);
		} else if (mode === 'alter') {
			this.handleAlterMatch(client);
		} else if (mode === 'ai') {
			this.handleAIMatch(client);
		} else if (mode === 'offline') {
			this.handleOfflineMatch(client);
		} else {
			client.send("Unavailable mode");
		}
	}

	// Handler for starting invite match
	private handleInviteMatch(client: Socket, inviteCode: string) {
		// Verify InviteCode
		const inviteInfo = this.inviteGame.get(inviteCode);
		const userInfo = this.playerInfoMap.get(client.id);

		if (!inviteInfo || !userInfo) {
			client.emit("Error", { message: 'Invalid Invitation Code' });
			return;
		}

		// Check if the player is in the list of invite
		if (inviteInfo.receiverId !== userInfo.userId && inviteInfo.senderId !== userInfo.userId) {
			client.emit("Error", { message: '404 Invitation Not Found' });
			return;
		}

		console.log(`Player ${client.id} is waiting for invite game.`);
		client.emit('matchStatus', { matchStatus: false });

		if (inviteInfo.receiverId === userInfo.userId) {
			inviteInfo.isReceiverWaiting = true;
			inviteInfo.receiverSocket = client;
		} else if (inviteInfo.senderId === userInfo.userId) {
			inviteInfo.isSenderWaiting = true;
			inviteInfo.senderSocket = client;
		}

		if (inviteInfo.isReceiverWaiting && inviteInfo.isSenderWaiting)
			this.createInviteMatch(inviteCode);
	}

	// Method to create an online match
	private async createInviteMatch(inviteCode: string) {
		const inviteInfo = this.inviteGame.get(inviteCode);

		const player1 = inviteInfo.senderSocket;
		const player2 = inviteInfo.receiverSocket;

		console.log(`Starting a game between ${player1.id} : ${player2.id}`)

		const game = new GameState(width, height, "invite", player1, player2);

		this.games.set(game, { hostId: player1.id, guestId: player2.id });

		game.initLeftPaddle(player1.id);
		game.initRightPaddle(player2.id);

		game.setHostId(player1.id);
		game.setGuestId(player2.id);

		player1.emit('matchStatus', { matchStatus: true });
		player2.emit('matchStatus', { matchStatus: true });

		const player1Data = this.playerInfoMap.get(player1.id);
		const player2Data = this.playerInfoMap.get(player2.id);

		await this.userService.updateStatus(player2Data?.userId, "INGAME");
		await this.userService.updateStatus(player1Data?.userId, "INGAME");

		player1.emit('oppenentData', {
			userId: player2Data?.userId,
			username: player2Data?.username,
			image: player2Data?.image,
			character: player2Data?.character,
			host: true,
		});

		player2.emit('oppenentData', {
			userId: player1Data?.userId,
			username: player1Data?.username,
			image: player1Data?.image,
			character: player1Data?.character,
			host: false,
		});

		const roomName = `inviteRoom_${player1.id}${player2.id}`;
		const roomData: RoomData = {
			roomId: roomName,
			players: [player1.id, player2.id],
		};

		this.activeRooms.set(roomName, roomData);

		player1.join(roomName);
		player2.join(roomName);

		this.updateAndBroadcastGameState();
	}

	// Handler for starting an online match
	private handleAlterMatch(client: Socket) {
		this.alterPlayersQueue.push(client);
		console.log(`Player ${client.id} is looking for an alter game.`);
		client.emit('matchStatus', { matchStatus: false });

		if (this.alterPlayersQueue.length >= 2) {
			this.createAlterMatch();
		}
	}

	// Method to create an online match
	private async createAlterMatch() {
		const player1 = this.alterPlayersQueue.shift()!;
		const player2 = this.alterPlayersQueue.shift()!;

		console.log(`Starting a game between ${player1.id} : ${player2.id}`)

		const game = new GameState(width, height, "alter", player1, player2);

		this.games.set(game, { hostId: player1.id, guestId: player2.id });

		game.initLeftPaddle(player1.id);
		game.initRightPaddle(player2.id);

		game.setHostId(player1.id);
		game.setGuestId(player2.id);

		player1.emit('matchStatus', { matchStatus: true });
		player2.emit('matchStatus', { matchStatus: true });

		const player1Data = this.playerInfoMap.get(player1.id);
		const player2Data = this.playerInfoMap.get(player2.id);

		await this.userService.updateStatus(player2Data?.userId, "INGAME");
		await this.userService.updateStatus(player1Data?.userId, "INGAME");

		player1.emit('oppenentData', {
			userId: player2Data?.userId,
			username: player2Data?.username,
			image: player2Data?.image,
			character: player2Data?.character,
			host: true,
		});

		player2.emit('oppenentData', {
			userId: player1Data?.userId,
			username: player1Data?.username,
			image: player1Data?.image,
			character: player1Data?.character,
			host: false,
		});

		const roomName = `onlineRoom_${player1.id}${player2.id}`;
		const roomData: RoomData = {
			roomId: roomName,
			players: [player1.id, player2.id],
		};

		this.activeRooms.set(roomName, roomData);

		player1.join(roomName);
		player2.join(roomName);

		this.updateAndBroadcastGameState();
	}

	// Handler for starting an online match
	private handleOnlineMatch(client: Socket) {
		this.onlinePlayersQueue.push(client);
		console.log(`Player ${client.id} is looking for an online game.`);
		client.emit('matchStatus', { matchStatus: false });

		if (this.onlinePlayersQueue.length >= 2) {
			this.createOnlineMatch();
		}
	}

	// Method to create an online match
	private async createOnlineMatch() {
		const player1 = this.onlinePlayersQueue.shift()!;
		const player2 = this.onlinePlayersQueue.shift()!;

		console.log(`Starting a game between ${player1.id} : ${player2.id}`)

		const game = new GameState(width, height, "online", player1, player2);

		this.games.set(game, { hostId: player1.id, guestId: player2.id });

		game.initLeftPaddle(player1.id);
		game.initRightPaddle(player2.id);

		game.setHostId(player1.id);
		game.setGuestId(player2.id);

		player1.emit('matchStatus', { matchStatus: true });
		player2.emit('matchStatus', { matchStatus: true });

		const player1Data = this.playerInfoMap.get(player1.id);
		const player2Data = this.playerInfoMap.get(player2.id);

		await this.userService.updateStatus(player2Data?.userId, "INGAME");
		await this.userService.updateStatus(player1Data?.userId, "INGAME");

		player1.emit('oppenentData', {
			userId: player2Data?.userId,
			username: player2Data?.username,
			image: player2Data?.image,
			character: player2Data?.character,
			host: true,
		});

		player2.emit('oppenentData', {
			userId: player1Data?.userId,
			username: player1Data?.username,
			image: player1Data?.image,
			character: player1Data?.character,
			host: false,
		});

		const roomName = `onlineRoom_${player1.id}${player2.id}`;
		const roomData: RoomData = {
			roomId: roomName,
			players: [player1.id, player2.id],
		};

		this.activeRooms.set(roomName, roomData);

		player1.join(roomName);
		player2.join(roomName);

		this.updateAndBroadcastGameState();
	}

	// Handler for starting an AI match
	private async handleAIMatch(client: Socket) {
		const game = new GameState(width, height, 'ai', client, client);
		this.games.set(game, { hostId: client.id, guestId: client.id });

		game.setHostId(client.id);
		game.setGuestId(client.id);

		game.initLeftPaddle(client.id);
		game.initRightPaddle(client.id);
		client.join('aiRoom');
		await this.userService.updateStatus(this.playerInfoMap.get(client.id).userId, "INGAME");
		this.updateAndBroadcastGameState();
	}

	// Handler for starting an offline match
	private async handleOfflineMatch(client: Socket) {
		const game = new GameState(width, height, "offline", client, client);
		this.games.set(game, { hostId: client.id, guestId: client.id });

		game.setHostId(client.id);
		game.setGuestId(client.id);
		game.initLeftPaddle(client.id);
		game.initRightPaddle(client.id);
		client.join('offlineRoom');
		await this.userService.updateStatus(this.playerInfoMap.get(client.id).userId, "INGAME");
		this.updateAndBroadcastGameState();
	}

	// Handler for updating paddle scale
	@SubscribeMessage('updatePaddleScale')
	updatePaddleScale(client: Socket, canvas: CanvasConfig) {
		const game = this.findGame(client.id);
		if (game) {
			game.updatePaddleScale(client.id, canvas);
		}
	}

	@SubscribeMessage('inviteGame')
	async HandleInviteGame(client: Socket, data: { time: Date, type: NotifType, isRead: boolean, senderId: string, receiverId: string, inviteCode: string }) {
		try {
			this.server.emit('RequestGame', data.inviteCode);
			const notification: CreateNotificationInput = {
				time: data.time,
				type: data.type,
				isRead: data.isRead,
				senderId: data.senderId,
				receiverId: data.receiverId,
				inviteCode: data.inviteCode
			}
			await this.notificationService.createNotification(notification);
			this.inviteGame.set(data.inviteCode, { senderId: data.senderId, senderSocket: client, isSenderWaiting: false, receiverId: data.receiverId, receiverSocket: null, isReceiverWaiting: false });
		} catch (error) {
			console.log(error);
		}
	}

	// Handler for updating paddle movement
	@SubscribeMessage('updatePaddleMovement')
	updatePaddleMovement(client: Socket, sideMovement: string) {
		const game = this.findGame(client.id);
		if (game) {
			game.updatePaddleMovement(client.id, sideMovement[0], sideMovement[1]);
		}
	}

	private findPlayerInfo(userId) {
		let user: PlayerInfo | null = null;
		this.playerInfoMap.forEach((value) => {
			if (userId === value.userId) {
				user = value;
				return;
			}
		})

		return user;
	}

	@SubscribeMessage('friendRequest')
	async friendRequest(client: Socket, { senderId, receiverId }) {
		const user = this.playerInfoMap.get(client.id);

		if (user) {
			if (user.userId != senderId && user.userId != receiverId) {
				client.send("Unauthorized!");
			}

			// Check receiverId existance
			const newFriend = this.prismaService.user.findUnique({
				where: {
					id: receiverId
				}
			})

			if (!newFriend) {
				client.send("No Friend is found!");
				return;
			}

			const data: CreateFriendInput = {
				senderId: senderId,
				receiverId: receiverId,
				isAccepted: false,
			}

			const newData = await this.friendService.createFriend(data);

			// send notification to the receiver friend
			if (newData) {
				client.emit("RequestSent", { friendId: newData.id });

				const friendInfo = this.findPlayerInfo(receiverId);

				if (friendInfo) {
					friendInfo.playerSocket.emit('RequestReceived', { username: user.username, userId: user.userId, image: user.image, friendId: newData.id });
				}
			}
		}
	}

	@SubscribeMessage('acceptRequest')
	async acceptRequest(client: Socket, data) {
		const user = this.playerInfoMap.get(client.id);

		if (user) {
			// Check receiverId existance
			const newFriend: Friend = await this.prismaService.friend.findUnique({
				where: {
					id: data.friendId
				}
			});

			if (!newFriend) {
				client.send("No Friend is found!");
				return;
			}

			const update = await this.friendService.updateAccept(user.userId, data.friendId);

			if (update) {
				const userFriend = this.findPlayerInfo(newFriend.senderId);
				const user = this.findPlayerInfo(newFriend.receiverId);

				client.emit('AcceptedRequest', { friendId: data.friendId });
				if (userFriend)
					userFriend.playerSocket.emit("RequestAccepted", { username: user.username, userId: user.userId, image: user.image })
				if (user)
					user.playerSocket.emit("RequestAccepted", { username: user.username, userId: user.userId, image: user.image })
			}
		}
	}
	@SubscribeMessage('removeFriend')
	async removeFriend(client: Socket, data) {
		const user = this.playerInfoMap.get(client.id);

		if (user) {
			// Check receiverId existance
			const newFriend: Friend = await this.prismaService.friend.findUnique({
				where: {
					id: data.friendId
				}
			});

			if (!newFriend) {
				client.send("No Friend is found!");
				return;
			}

			const deleteFriend = await this.friendService.deleteFriend(user.userId, data.friendId);

			if (deleteFriend) {
				const receiver = this.findPlayerInfo(newFriend.receiverId);
				const sender = this.findPlayerInfo(newFriend.senderId);

				// client.emit('FriendRemoved', { friendId: data.friendId });
				if (sender)
					sender.playerSocket.emit("FriendRemoved");
				if (receiver)
					receiver.playerSocket.emit("FriendRemoved");
			}
		}
	}

	@SubscribeMessage('friendDisconnected')
	async friendDisconnected(client: Socket) {
		const user = this.playerInfoMap.get(client.id);
		const friendsList = await this.friendService.getFriendList(user.userId);
		this.server.emit("Disconnected");
	}

	private startGameLoop() {
		setInterval(() => {
			this.updateAndBroadcastGameState();
		}, 1000 / 60); // 60 times per second
	}
}