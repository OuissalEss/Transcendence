import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from './prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@prisma/client';

@Injectable()
export class MuteService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	private readonly logger = new Logger(MuteService.name);

	async getMuteList(cid: string): Promise<User[]> {
		const mutes = await this.prisma.mute.findMany({
			where: {
				channelId: cid,
			},
		});
		const users: User[] = [];
		for (let i = 0; i < mutes.length; i++) {
			const user = await this.prisma.user.findUnique({
				where: {
					id: mutes[i].userId,
				},
			});
			users.push(user);
		}
		return users;
	}

	@Cron(CronExpression.EVERY_5_MINUTES)
    async removeExpiredMutes() {
        const mutes = await this.prisma.mute.findMany();
        for (let i = 0; i < mutes.length; i++) {
            if (mutes[i].permanent)
                continue;
            if (mutes[i].duration < new Date()) {
                this.prisma.mute.update({
                    where: {id: mutes[i].id},
                    data: {finished: true},
                });
            
            }
        }
    }

    async removeMuteListByCID(id: string) {
        this.prisma.mute.deleteMany({
            where: {
                channelId: id
            },
        }).then(() => {
            this.logger.log(`Mutes with Channel ID ${id} has been deleted`);
        });
    }

	async muteUser(cid: string, uid: string, duration: Date, permanent: boolean) {
        const mute = await this.prisma.mute.create({
            data: {
                userId: uid,
                channelId: cid,
                duration: duration,
                finished: false,
                permanent: permanent,
            },
        });
        await this.prisma.user.update({
            where: {id: uid},
            data: {
                banned: {
                    connect: {
                        id: mute.id,
                    },
                },
            },
        });
        
    }

    async unmuteUser(cid: string, uid: string) {
        return this.prisma.mute.deleteMany({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            },
        });
    }
}
