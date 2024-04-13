import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ChannelUser } from '../entities/channel-user.entity';
import { UserType } from '@prisma/client'; // Ensure you import UserType from the correct path
import { CreateChannelUserInput } from 'src/services/dto/create-channel-user.input'; // Create an appropriate DTO

@Injectable()
export class ChannelUserService {
    constructor(private prisma: PrismaService) {}

    async getAllChannelUsers(): Promise<ChannelUser[]> {
        return this.prisma.channelUser.findMany({});
    }

    async getChannelUserById(id: string): Promise<ChannelUser> {
        return this.prisma.channelUser.findUnique({
            where: { id: id },
        });
    }

    async getChannelUserByChannelId(channelId: string): Promise<ChannelUser[]> {
        return this.prisma.channelUser.findMany({
            where: { channelId: channelId },
        });
    }

    async getChannelUserByUserId(userId: string): Promise<ChannelUser[]> {
        return this.prisma.channelUser.findMany({
            where: { userId: userId },
            include: {
                channel: true,
            }
        });
    }

    async getChannelUser(cid: string, uid: string): Promise<ChannelUser> {
		return this.prisma.channelUser.findFirst({
			where: {
				AND: [{ userId: uid }, { channelId: cid }],
			},
		});
    }

    async createChannelUser(createUserChannelInput: CreateChannelUserInput): Promise<ChannelUser> {
        try {
            return this.prisma.channelUser.create({
                data: {
                    userId: createUserChannelInput.userId,
                    channelId: createUserChannelInput.channelId,
                    type: UserType[createUserChannelInput.type], // Ensure the correct mapping from enum to string
                },
            });
        } catch (e) {
            throw new ForbiddenException('Unable to create ChannelUser.');
        }
    }

    async updateChannelTypeUser(id: string, type: UserType): Promise<ChannelUser> {
        return this.prisma.channelUser.update({
            where: { id: id },
            data: {
                type: UserType[type],
            },
        });
    }
    
    async deleteChannelUser(id: string): Promise<ChannelUser> {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    channelId: id,
                },
            });
            for (let i = 0; i < messages.length; i++) {
                await this.prisma.message.delete({
                    where: { id: messages[i].id },
                });
            }
            return this.prisma.channelUser.delete({
                where: { id: id },
            });
        } catch (e) {
            throw new ForbiddenException('Unable to delete ChannelUser.');
        }
    }
}
