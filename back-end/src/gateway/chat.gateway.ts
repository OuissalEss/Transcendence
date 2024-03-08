import { Logger } from "@nestjs/common";
import {SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3003, {namespace: 'chat'})
export class ChatGateway {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('ChatGateway');
    
    handleConnection(client: Socket,) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() messageDto: any): void {
      const { room, message, sender } = messageDto;
      // Broadcast the message to all users in the specified chat room
      this.server.to(room).emit('message', { message, sender });
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string): void {
        // Add the client to the room
        this.server.socketsJoin(room);
        // Notify other participants that a new user has joined
        this.server.to(room).emit('userJoined', 'A new user has joined the room');
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string): void {
        // Remove the client from the room
        this.server.socketsLeave(room);
        // Notify other participants that a user has left
        this.server.to(room).emit('userLeft', 'A user has left the room');
    }

    // typing
    @SubscribeMessage('typing')
    handleTyping(@MessageBody() room: string): void {
        this.server.to(room).emit('typing', 'typing ...');
    }


}