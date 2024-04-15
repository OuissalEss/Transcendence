import { Logger } from "@nestjs/common";
import {SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Payload } from "@prisma/client/runtime/library";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from 'socket.io';
import { BanService } from "src/services/ban.service";
import { BlockService } from "src/services/block.service";
import { ChannelService } from "src/services/channel.service";
import { CreateChannelInput } from "src/services/dto/create-channel.input";
import { CreateNotificationInput } from "src/services/dto/create-notification.input";
import { MessageService } from "src/services/message.service";
import { MuteService } from "src/services/mute.service";
import { NotificationService } from "src/services/notification.service";
import { UserService } from "src/services/user.service";

@WebSocketGateway(3003, {namespace: 'chat', cors: '*'})
export class ChatGateway {
    constructor(
        private readonly message: MessageService,
        private readonly mute: MuteService,
        private readonly ban: BanService,
        private readonly channel: ChannelService,
        private readonly notif: NotificationService,
        private readonly block: BlockService,
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

            // this.logger.log(`Message: ${text} Sender: ${sender}`);
            if (!room || !text || !sender) {
                throw new Error('Invalid message data');
            }
            const message = await this.message.createMessage({ sender, text, time: new Date() , channelId: room });
            const ssender = await this.message.getMessageSender(message.id as string);
            // console.log(message);
            // console.log(ssender);
            this.server.to(room).emit('messageSent', { id: message.id, sender : ssender.username, text: message.text, time : message.time, senderId: ssender.id, read: message.read}, room);
            this.server.emit('msg', { id: message.id, sender : ssender.username, text: message.text, time : message.time, senderId: ssender.id, read: message.read}, room);

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
    async handleLeaveRoom(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            // this.server.to(room).emit('userLeft');
            // this.server.emit('removeUser', room, user);
            const User = await this.channel.leaveChannel(room, user);
            this.logger.log(`Client left room: ${room} User: ${User.id}`);
            this.server.to(room).emit('userRemoved', { id: User.id, name: User.username, icon: undefined, status: User.status }, room, 0);
            this.server.emit('remove', room, user);
            // this.server.socketsLeave(room);
        } catch (e) {
            this.logger.error(e.message);
        }

    }

    @SubscribeMessage('DM')
    async handleDirectMessage(@MessageBody() data: {id1: string, id2: string}) {      
        try {
           const  {id1, id2} = data;
        //    console.log(id1);
        //    console.log(id2);
           let room = await this.channel.checkDM(id1, id2);

            // check if there's not an already existing conversation with the two
            if (room) {
                console.log(room)
                this.server.socketsJoin(room);
                this.logger.log(`Client joined room: ${room}`);   
                this.server.to(room).emit('dmCreated', room);
                this.server.emit("addRoom", room);
            } else {
                let room = await this.channel.createChannel({
                    title: "",
                    type: "DM",
                    ownerId: id2,
                });
                await this.channel.addMember(room.id as string, id1);
                this.server.socketsJoin(room.id  as string);
                this.logger.log(`Client joined room: ${room.id}`);   
                this.server.to(room.id as string).emit('dmCreated', room.id);
                this.server.emit("addRoom", room.id as string);
            }
        } catch (e) {
            this.logger.error(e.message);
        }

    }


    @SubscribeMessage('typing')
    handleTyping(@MessageBody() data: { room: string; user: string }): void {
      const { room, user } = data;
        this.logger.log(`Client is typing in room: ${room}`);
      this.server.to(room).emit('userTyping', user, room); // Broadcast userTyping event to all users in the room
      this.server.emit('typingDiscussion', user, room);
    }
    
    @SubscribeMessage('stopTyping')
    handleStopTypingEvent(@MessageBody() roomId: string) {
        this.logger.log(`Client stopped typing in room: ${roomId}`);
        this.server.to(roomId).emit('userStoppedTyping');
        this.server.emit('stopTypingDiscussion', roomId);
    }

    @SubscribeMessage('muteUser')
    async handleMuteUser(@MessageBody() data: { room: string; user: string, duration: Date, permanent: boolean }) {
        try {
            const { room, user, duration, permanent } = data;
            this.logger.log(`Client is muting user: ${user} in room: ${room}`);
            const User = await this.mute.muteUser(room, user, duration, permanent);
            this.server.to(room).emit('mutedAdded', { id: user, name: User.username, icon: undefined }, 1);

        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('UnmuteUser')
    async handleUnmuteUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is unmuting user: ${user} in room: ${room}`);
            const User = await this.mute.unmuteUser(room, user);
            this.server.to(room).emit('mutedRemoved', { id: user, name: User.username, icon: undefined }, 0);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('banUser')
    async handleBanUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is banning user: ${user} in room: ${room}`);
            const User = await this.ban.banUser(room, user);
            this.server.to(room).emit('userBanned', { id: User.id, name: User.username, icon: undefined }, room, 1);
            this.server.emit('remove', room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('unbanUser')
    async handleUnbanUser(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is unbanning user: ${user} in room: ${room}`);
            const User = await this.ban.unbanUser(room, user);
            this.server.to(room).emit('userUnbanned', { id: User.id, name: User.username, icon: undefined }, room, 0);

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
            this.server.emit('addRoom', room);
            this.server.to(room).emit('userAdded', { id: User.id, name: User.username, icon: User.avatar.filename, status: User.status, xp: User.xp }, room, 1);
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
            this.server.to(room).emit('userRemoved', { id: User.id, name: User.username, icon: undefined, status: User.status }, room, 0);
            this.server.emit('remove', room, user);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('addMod')
    async handleAddMod(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is adding user: ${user} as a mod in room: ${room}`);
            const User = await this.channel.addAdmin(room, user);
            this.server.to(room).emit('adminAdded', {id: User.id, name: User.username, icon: User.avatar.filename}, 1);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('removeMod')
    async handleRemoveMod(@MessageBody() data: { room: string; user: string }) {
        try {
            const { room, user } = data;
            this.logger.log(`Client is removing user: ${user} as a mod in room: ${room}`);
            const User = await this.channel.removeAdmin(room, user);
            this.server.to(room).emit('adminRemoved', {id: User.id, name: User.username, icon: undefined}, 0);
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('inviteGame')
    async handleInviteGame(@MessageBody() data: CreateNotificationInput) {
        try {
            this.logger.log(`invite to game`);
            await this.notif.createNotification(data);
            this.server.emit('RequestGame');
        } catch (e) {
            this.logger.error(e);
        } 
    }

    @SubscribeMessage('blockUser')
    async handleBlockUser(@MessageBody() data: { blockerId: string, blockedUserId: string }) {
        try {
            const { blockerId, blockedUserId } = data;
            this.logger.log(`Client is blocking user: ${blockedUserId}`);
            await this.block.blockUser(blockerId, blockedUserId);
            this.server.emit('userBlocked', data);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('unblockUser')
    async handleUnblockUser(@MessageBody() data: { blockerId: string, blockedUserId: string}) {
        try {
            const { blockerId, blockedUserId } = data;
            this.logger.log(`Client is unblocking user: ${blockedUserId}`);
            // await this.block.unblockUser(blockerId, blockedUserId);
            this.server.emit('userUnblocked', data);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('readMessage')
    async handleReadMessage(@MessageBody() data: { messageId: string, userId: string, roomId: string }) {
        try {
            const { messageId, userId, roomId } = data;
            this.logger.log(`Client is reading message: ${messageId}`);
           await this.message.readMessage(messageId, userId, roomId);
           const senderId = await this.message.getMessageSender(messageId);
            this.server.emit('messageRead', senderId);
        } catch (e) {
            this.logger.error(e);
        }
    }

    @SubscribeMessage('channelUpdate')
    async handleUpdateChannel(@MessageBody() payload: { data: any, opt: number, room: string }) {
        try {
            const { data, opt, room } = payload;
            this.logger.error(`${data} ${opt} ${room} ${payload}`);
            
            switch (opt) {
                case 1:
                    const { title } = data;
                    this.server.emit("updateChannel", {data: { title }, opt: 1, room});
                    this.logger.log(`Room ${room}'s title is being updated`);
                    break;
                case 2:
                    const { description } = data;
                    this.server.emit("updateChannel", {data: { description }, opt: 2, room});
                    this.logger.log(`Room ${room}'s description is being updated`);
                    break;
                case 3:
                    const { password, type } = data;
                    this.server.emit("updateChannel", {data: { password, type }, opt: 3, room});
                    this.logger.log(`Room ${room}'s privacy is being updated`);
                    break;
                default:
                    break;
            }
        } catch (e) {
            this.logger.error(e);
        }
    }
    

    @SubscribeMessage('unreadMessage')
    async handleUnreadMessage(@MessageBody() userId: string) {
        try {
            this.logger.log(`Client ${userId} received a message`);
            this.server.emit('messageUnread', userId);
        } catch (e) {
            this.logger.error(e);
        }
    }
}