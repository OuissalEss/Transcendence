// message.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Message } from '../entities/message.entity';
import { CreateMessageInput } from 'src/services/dto/create-message.input';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async getAllMessages(): Promise<Message[]> {
        return this.prisma.message.findMany({});
    }

    async getMessageById(messageId: string): Promise<Message> {
        return this.prisma.message.findUnique({
            where: { id: messageId },
        });
    }

    async createMessage(createMessageInput: CreateMessageInput): Promise<Message> {
        return this.prisma.message.create({
            data: {
                text: createMessageInput.text,
                time: createMessageInput.time,
                channelId: createMessageInput.channelId,
            },
        });
    }
    // Additional methods can be added based on your requirements
    async deleteMessage(messageId: string): Promise<Message> {
        return this.prisma.message.delete({
            where : {id : messageId}
        })
    }
}
