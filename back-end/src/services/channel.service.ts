import {ConsoleLogger, ForbiddenException, Inject, Injectable, Logger, forwardRef} from '@nestjs/common';

import { Channel } from 'src/entities/channel.entity'
import {PrismaService} from "src/services/prisma.service";
import {CreateChannelInput} from "./dto/create-channel.input";
import {channelIncludes} from "../includes/channel.includes";
import { ChannelType, UserType } from '@prisma/client';
import { ChannelUserService } from './channel-user.service';
import { User } from 'src/entities/user.entity';
import { MuteService } from './mute.service';
import { BanService } from './ban.service';

@Injectable()
export class ChannelService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly channelUserService: ChannelUserService,
        private readonly muteService: MuteService,
        @Inject(forwardRef(() => BanService))
        private readonly banService: BanService,
    ) {}

    private logger = new Logger('ChannelService');

        // send match invitation through notification
        // access user profile
        // 

    /**
     * Accessors
    */

    async getAllChannels(): Promise<Channel[]> {
        return this.prisma.channel.findMany({
            include: channelIncludes
        });
    }
    
    async getChannelById(cid: string): Promise<Channel> {
        return this.prisma.channel.findUnique({
            where: {id: cid},
            include: channelIncludes
        })
    }

    async getChannelByTitle(title: string): Promise<Channel> {
        return this.prisma.channel.findUnique({
            where: {title: title},
            include: channelIncludes
        })
    }

    async getChannelByType(type: ChannelType): Promise<Channel[]> {
        return this.prisma.channel.findMany({
            where: {type: type},
            include: channelIncludes
        })
    }

    async getChannelOwner(cid: string): Promise<User> {
        try {
            const channelUser = await this.channelUserService.getChannelUserByChannelId(cid);
            let ownerId: string;
            for (let i = 0; i < channelUser.length; i++)
                if (channelUser[i].type === UserType.OWNER)
                    ownerId = channelUser[i].userId;
            return await this.prisma.user.findFirst({
                where: {id: ownerId}
            });
        } catch (e) {
            this.logger.error(`Unable to get Channel Owner: ${e.message} cid: ${cid}`);
        }            
    }
 

    async getChannelAdmins(cid: string): Promise<User[]> {
        const channelUser = await this.channelUserService.getChannelUserByChannelId(cid);
        let admins: User[] = [];
        for (let i = 0; i < channelUser.length; i++)
            if (channelUser[i].type == UserType.ADMIN)
                admins.push(await this.prisma.user.findUnique({
                    where: {id: channelUser[i].userId}
                }));
        return admins;
    }

    async getChannelsByOwner(uid: string): Promise<Channel[]> {
        const channelUser = await this.channelUserService.getChannelUserByUserId(uid);
        let channels: Channel[] = [];
        for (let i = 0; i < channelUser.length; i++) {
            const channel = await this.prisma.channel.findUnique({
                where: {id: channelUser[i].channelId as string}
            });
            if (channel != null && channelUser[i].type == UserType.OWNER)
                channels.push(channel);
        }
        return channels;
    }

    async getChannelMembers(id: string): Promise<User[]> {
        const channelUser = await this.channelUserService.getChannelUserByChannelId(id);
        let users: User[] = [];
        for (let i = 0; i < channelUser.length; i++)
            users.push(await this.prisma.user.findUnique({
                where: {id: channelUser[i].userId}
            }));
        return users;
    }

    async getChannelDescription(cid: string): Promise<string> {
        const channel = await this.prisma.channel.findUnique({
            where: {id: cid},
        });
        return channel.description;
    }

    async getChannelProfileImage(cid: string): Promise<string> {
        const channel = await this.prisma.channel.findUnique({
            where: {id: cid},
        });
        return channel.profileImage;
    }

    /**
     * helpers
     */

    async isUserInChannel(cid: string, uid: string): Promise<boolean> {
        const channelUser = await this.channelUserService.getChannelUser(cid, uid);
        return channelUser != null;
    }

    async isUserAdmin(cid: string, uid: string): Promise<boolean> {
        const channelUser = await this.channelUserService.getChannelUser(cid, uid);
        return channelUser.type == UserType.ADMIN;
    }

    async isUserOwner(cid: string, uid: string): Promise<boolean> {
        const channelUser = await this.channelUserService.getChannelUser(cid, uid);
        return channelUser.type == UserType.OWNER;
    }

    /**
     * Mutators
    */

    async removeAdmin(cid: string, uid: string) {
        // check permissions
        const channelUser = await this.channelUserService.getChannelUser(cid, uid);
        return this.prisma.channelUser.update({
            where: {id: channelUser.id},
            data: {type: UserType.USER},
        });
    }

    async addAdmin(cid: string, uid: string) {
        // check permissions
        try {
            const channelUser = await this.channelUserService.getChannelUser(cid, uid);
            if (channelUser) {
                return this.prisma.channelUser.update({
                    where: {id: channelUser.id},
                    data: {type: UserType.ADMIN},
                });                  
            }
            else {
                return this.channelUserService.createChannelUser({
                    userId: uid, channelId: cid, type: UserType.ADMIN,
                    id: '',
                    message: []
                });
            }
        } catch (e) {
            this.logger.error(`Unable to add Admin to Channel: ${e.message} cid: ${cid} uid: ${uid}`);
        }

    }

    async removeMember(cid: string, uid: string) {
        try {
            const channelUser = await this.channelUserService.getChannelUser(cid, uid);
            if (!channelUser)
                throw new ForbiddenException("User is not in channel");
            await this.channelUserService.deleteChannelUser(channelUser.id);
            return await this.prisma.user.findUnique({
                where: {id: uid}
            });
        } catch (e) {
            this.logger.error(`Unable to remove Member from Channel: ${e.message} cid: ${cid} uid: ${uid}`);
        }

    }

    async addMember(cid: string, uid: string) {
        try {
            await this.prisma.channelUser.create({
                data: {
                    type: UserType.USER,
                    channel: {
                        connect: {
                            id: cid,
                        },
                    },
                    user: {
                        connect: {
                            id: uid,
                        },
                    },
                },
            });
            return await this.prisma.user.findUnique({
                where: {id: uid}
            });
        } catch (e) {
            this.logger.error(`Unable to add Member to Channel: ${e.message} cid: ${cid} uid: ${uid}`);
        }

    }

    async deleteChannel(id: string) {
        try {
            this.banService.removeBanListByCID(id);
            this.muteService.removeMuteListByCID(id);
            const channelUsers = await this.channelUserService.getChannelUserByChannelId(id);
            for (let i = 0; i < channelUsers.length; i++)
                this.channelUserService.deleteChannelUser(channelUsers[i].id);
            this.prisma.channel.delete({
                where: {id: id}
            }).then(() => {
                this.logger.log(`Channel with ID ${id} has been deleted`);
            });            
        } catch (e) {
            throw new ForbiddenException("Unable to delete Channel.");
        }
    }
    
    async createChannel(createChannelInput: CreateChannelInput): Promise<Channel> {
        try {
            const channel = await this.prisma.channel.create({
                data: {
                    title: createChannelInput.title,
                    type: createChannelInput.type,
                },
                include: channelIncludes
            });
            if (createChannelInput.description)
                this.updateChannelDescription(channel.id, createChannelInput.description);
            if (createChannelInput.profileImage)
                this.updateChannelProfileImage(channel.id, createChannelInput.profileImage);
            if (createChannelInput.password)
                this.updateChannelPassword(channel.id, createChannelInput.password);
            if (createChannelInput.ownerId) {
                const user = await this.channelUserService.createChannelUser({
                    userId: createChannelInput.ownerId, channelId: channel.id, type: UserType.OWNER,
                    id: '',
                    message: []
                });
                // connect channel with user
                
            }
            return channel;
        } catch (e) {
            throw new ForbiddenException("Unable to create Channel.");
        }
    }
    
    async updateChannelPassword(cid: string, password: string): Promise<Channel> {
        return this.prisma.channel.update({
            where: {id: cid},
            data: {password: password},
            include: channelIncludes
        });
    }

    async updateChannelType(cid: string, type: ChannelType, password?: string): Promise<Channel> {
        if (type === ChannelType.PRIVATE) {
            return this.prisma.channel.update({
                where: {id: cid},
                data: {type: type, password: password},
                include: channelIncludes
            });
        }
        return this.prisma.channel.update({
            where: {id: cid},
            data: {type: type},
            include: channelIncludes
        });
    }

    async updateChannelTitle(cid: string, title: string): Promise<Channel> {
        return this.prisma.channel.update({
            where: {id: cid},
            data: {title: title},
            include: channelIncludes
        });
    }

    async updateChannelDescription(cid: string, description: string): Promise<Channel> {
        return this.prisma.channel.update({
            where: {id: cid},
            data: {description: description},
            include: channelIncludes
        });
    }

    async updateMuteUser(cid: string, uid: string, duration: Date, permanent: boolean) {
        // get mute id
        const mute = await this.prisma.mute.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });
        await this.prisma.mute.update({
            where: {id: mute.id},
            data: {duration: duration, permanent: permanent},
        });
    }

    async updateChannelProfileImage(cid: string, profileImage: string): Promise<Channel> {
        return this.prisma.channel.update({
            where: {id: cid},
            data: {profileImage: profileImage},
            include: channelIncludes
        });
    }

    async joinChannel(cid: string, uid: string, password?: string) {
        const channel = await this.prisma.channel.findUnique({
            where: {id: cid},
        });
        if (await this.banService.isUserBanned(cid, uid))
            throw new ForbiddenException("User is banned from channel");
        if (channel.type === ChannelType.PUBLIC) {
            return this.prisma.channelUser.create({
                data: {
                    type: UserType.USER,
                    channel: {
                        connect: {
                            id: cid,
                        },
                    },
                    user: {
                        connect: {
                            id: uid,
                        },
                    },
                },
                include: channelIncludes
            });
        } else {
            if (channel.password === password) {
                return this.prisma.channelUser.create({
                    data: {
                        type: UserType.USER,
                        channel: {
                            connect: {
                                id: cid,
                            },
                        },
                        user: {
                            connect: {
                                id: uid,
                            },
                        },
                    },
                    include: channelIncludes
                });
            } else {
                throw new ForbiddenException("Invalid password");
            }
        }
    }

    async leaveChannel(cid: string, uid: string) {
        const channelUser = await this.channelUserService.getChannelUser(cid, uid);
        return this.channelUserService.deleteChannelUser(channelUser.id);
    }
}
