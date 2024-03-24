import { Logger } from "@nestjs/common";
import {SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from 'socket.io';
import { BanService } from "src/services/ban.service";
import { ChannelService } from "src/services/channel.service";
import { CreateChannelInput } from "src/services/dto/create-channel.input";
import { CreateNotificationInput } from "src/services/dto/create-notification.input";
import { MessageService } from "src/services/message.service";
import { MuteService } from "src/services/mute.service";
import { NotificationService } from "src/services/notification.service";

@WebSocketGateway(3003, {namespace: 'chat', cors: '*'})
export class ChatGateway {
    constructor(
        private readonly message: MessageService,
        private readonly mute: MuteService,
        private readonly ban: BanService,
        private readonly channel: ChannelService,
        private readonly notif: NotificationService,
    ) {}

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('ChatGateway');
    
    handleConnection(client: Socket,) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() messageDto: any): Promise<void> {
        try {
            const { room, text, sender } = messageDto;

            this.logger.log(`Message: ${text} Sender: ${sender}`);
            if (!room || !text || !sender) {
                throw new Error('Invalid message data');
            }
            const message = await this.message.createMessage({ sender, text, time: new Date() , channelId: room });
            const ssender = await this.message.getMessageSender(message.id as string);
            console.log(message);
            console.log(ssender);
            this.server.to(room).emit('sendMessage', { sender : ssender, text: message.text, time : message.time});

        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string): void {
        // Add the client to the room
        this.server.socketsJoin(room);
        // Notify other participants that a new user has joined
        this.logger.log(`Client joined room: ${room}`);
        this.server.to(room).emit('userJoined', 'A new user has joined the room');
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() room: string): void {
        // Remove the client from the room
        this.server.socketsLeave(room);
        // Notify other participants that a user has left
        this.server.to(room).emit('userLeft', 'A user has left the room');
    }


    @SubscribeMessage('typing')
    handleTyping(@MessageBody() data: { room: string; user: string }): void {
      const { room, user } = data;
        this.logger.log(`Client is typing in room: ${room}`);
      this.server.to(room).emit('userTyping', user); // Broadcast userTyping event to all users in the room
    }
    
    @SubscribeMessage('stopTyping')
    handleStopTypingEvent(@MessageBody() roomId: string) {
        this.logger.log(`Client stopped typing in room: ${roomId}`);
        this.server.to(roomId).emit('userStoppedTyping'); // Broadcast userStoppedTyping event to all users in the room
    }

    @SubscribeMessage('muteUser')
    async handleMuteUser(@MessageBody() data: { room: string; user: string, duration: Date, permanent: boolean }) {
        try {
            const { room, user, duration, permanent } = data;
            this.logger.log(`Client is muting user: ${user} in room: ${room}`);
            await this.mute.muteUser(room, user, duration, permanent);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('UnmuteUser')
    async handleUnmuteUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is unmuting user: ${user} in room: ${room}`);
            await this.mute.unmuteUser(room, user);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('banUser')
    async handleBanUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is banned user: ${user} in room: ${room}`);
            await this.ban.banUser(room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('unbanUser')
    async handleUnbanUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is banned user: ${user} in room: ${room}`);
            await this.ban.unbanUser(room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('add')
    async handleAddMember(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is adding user: ${user} in room: ${room}`);
            const User = await this.channel.addMember(room, user);
            this.server.to(room).emit('userAdded', { id: User.id, name: User.username, icon: User.avatarTest, status: User.status }, 1);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('kick')
    async handleRemoveMember(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is removing user: ${user} in room: ${room}`);
            const User = await this.channel.removeMember(room, user);
            this.server.to(room).emit('userRemoved', { id: User.id, name: User.username, icon: User.avatarTest, status: User.status }, 0);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('addMod')
    async handleAddMod(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is adding user: ${user} as a mod in room: ${room}`);
            await this.channel.addAdmin(room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('removeMod')
    async handleRemoveMod(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is removing user: ${user} as a mod in room: ${room}`);
            await this.channel.removeAdmin(room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('inviteGame')
    async handleInviteGame(@MessageBody() data: CreateNotificationInput) {
        try {
            this.logger.log(`invite to game`);
            await this.notif.createNotification(data);
            this.server.emit('game invitation sent created');
        } catch (e) {
            this.logger.error(e);
        } 
    }

    

}