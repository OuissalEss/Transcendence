// message.service.ts
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Message } from '../entities/message.entity';
import { CreateMessageInput } from 'src/services/dto/create-message.input';
import { ChannelUserService } from './channel-user.service';
import { User } from '@prisma/client';

@Injectable()
export class MessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly channelUser: ChannelUserService,
    ) {}

    private logger = new Logger('MessageService');

    async getAllMessages(): Promise<Message[]> {
        return this.prisma.message.findMany({});
    }

    async getMessageById(messageId: string): Promise<Message> {
        return this.prisma.message.findUnique({
            where: { id: messageId },
        });
    }

    async getAllMessagesByChannelId(cid: string): Promise<Message[]> {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    channel: {
                        channelId: cid,
                    }
                },
            })
            if (messages)
                return messages;
            return [];
        } catch (e) {
            console.error(e);
        }
    }

    async getAllMessagesByUserId(uid: string): Promise<Message[]> {
        return this.prisma.message.findMany({
            where: {
                channel: {
                    userId: uid,
                }
            },
        });
    }

    async createMessage(input: CreateMessageInput): Promise<Message> {
        try {
            const channelUser = await this.channelUser.getChannelUser(input.channelId, input.sender);
            if (!channelUser)
                throw new Error('User is not a member of the channel');
            return this.prisma.message.create({
                data: {
                    text: input.text,
                    time: input.time,
                    channel: { connect: { id: channelUser.id } }, // Add the 'channel' property
                },
            });        
        } catch (e) {
            console.error(e);
        }
    }

    async updateMessage(mid: string, text: string): Promise<Message> {
        return this.prisma.message.update({
            where: { id: mid },
            data: {
                text: text,
                updatedAt: new Date(),
            },
        });
    }

    async deleteMessage(messageId: string): Promise<Message> {
        return this.prisma.message.delete({
            where : {id : messageId}
        })
    }

    async getMessageSender(mid: string): Promise<User> {
        try {
            const msg = await this.prisma.message.findUnique({
                where: { id: mid },
                include: {
                    channel: true,
                },
            });
            if (!msg)
                throw new Error('Message not found');
            const channdlUser = await this.channelUser.getChannelUserById(msg.channelId);
            if (!channdlUser)
                throw new Error('Channel User not found');
            const user = await this.prisma.user.findUnique({
                where: { id: channdlUser.userId },
                include: {
                    avatar: true,
                }
            });
            return user;
        } catch (e) {
            console.error(e);
        }
    }

    async readMessage(mid: string, uid: string, cid: string) {
        try {
            const msg = await this.prisma.message.update({
                where: { id: mid },
                data: { read: true },
            });
            this.logger.log(`Message ${msg.text} read by ${uid} status : ${msg.read}`);
        } catch (e) {
            this.logger.error(e.message);
            throw new Error("Failed to read message");
        }
    }
}
