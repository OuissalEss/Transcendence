import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class BanService {
	constructor(
		private readonly prisma: PrismaService,
        @Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService,
	) {}

	private readonly logger = new Logger(BanService.name);
	
	async getBannedUserListByCid(cid: string): Promise<User[]> {
		const bans = await this.prisma.ban.findMany({
			where: {
				channelId: cid,
			},
		});
		const users: User[] = [];
        for (let i = 0; i < bans.length; i++) {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: bans[i].userId,
                },
                include: {
                    avatar: true,
                }
            });
            users.push(user);
        }
        return users;
	}

    async getBannedUserListByUid(uid: string): Promise<User[]> {
        const bans = await this.prisma.ban.findMany({
            where: {
                userId: uid,
            },
        });
        const users: User[] = [];
        for (let i = 0; i < bans.length; i++) {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: bans[i].userId,
                },
                include: {
                    avatar: true,
                }
            });
            users.push(user);
        }
        return users;
    }

    async getBanList(): Promise<User[]> {
        const bans = await this.prisma.ban.findMany();
        const users: User[] = [];
        for (let i = 0; i < bans.length; i++) {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: bans[i].userId,
                },
                include: {
                    avatar: true,
                }
            });
            users.push(user);
        }
        return users;
    }

	async removeBanListByCID(id: string) {
        this.prisma.ban.deleteMany({
            where: {
                channelId: id
            },
        }).then(() => {
            this.logger.log(`Bans with Channel ID ${id} has been deleted`);
        });
    }

    async removeBanListByUID(id: string) {
        this.prisma.ban.deleteMany({
            where: {
                userId: id
            },
        }).then(() => {
            this.logger.log(`Bans with User ID ${id} has been deleted`);
        });
    }
	
    async banUser(cid: string, uid: string) {
        // check permissions
        let ban = await this.prisma.ban.findFirst({where:{userId: uid, channelId: cid}})
        if (ban) {
            ban = await this.prisma.ban.create({
                data: {
                    userId: uid,
                    channelId: cid,
                },
            });
        }
        const user =this.channelService.removeMember(cid, uid);
        return await this.prisma.user.update({
            where: {id: uid},
            data: {
                banned: {
                    connect: {
                        id: ban.id,
                    },
                },
            },
            include: {
                avatar: true,
            }
        });
    }

    async unbanUser(cid: string, uid: string) {
        await this.prisma.ban.deleteMany({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            },
        });
        return await this.prisma.user.findFirst({
            where: {
                id: uid,
            },
            include: {
                avatar: true,
            }
        });
    }

    async isUserBanned(cid: string, uid: string): Promise<boolean> {
        const banned = await this.prisma.ban.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });
        return banned != null;
    }
}
