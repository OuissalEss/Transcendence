import {ForbiddenException, Injectable} from '@nestjs/common';

import { Channel } from 'src/entities/channel.entity'
import {PrismaService} from "src/services/prisma.service";
import {CreateChannelInput} from "./dto/create-channel.input";
import {channelIncludes} from "../includes/channel.includes";

@Injectable()
export class ChannelService {
    constructor(private prisma: PrismaService) {
    }
    async getAllChannels(): Promise<Channel[]> {
        return this.prisma.channel.findMany({
            include: channelIncludes
        });
    }
    
    async getChannelById(id: string): Promise<Channel> {
        return this.prisma.channel.findUnique({
            where: {id: id},
            include: channelIncludes
        })
    }
    
    async createChannel(createChannelInput: CreateChannelInput): Promise<Channel> {
        try {
            return this.prisma.channel.create({
                data: {
                    title: createChannelInput.title,
                    type: createChannelInput.type,
                    password: createChannelInput.password,
                },
                include: channelIncludes
            });
        } catch (e) {
            throw new ForbiddenException("Unable to create Channel.");
        }
    }
}
