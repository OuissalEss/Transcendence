import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from './prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { mute } from 'src/entities/mute.entity';

@Injectable()
export class MuteService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	private readonly logger = new Logger(MuteService.name);

	async getMutedUserListCid(cid: string): Promise<User[]> {
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

    async getMuteListUid(uid: string): Promise<User[]> {
        const mutes = await this.prisma.mute.findMany({
            where: {
                userId: uid,
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

    async getMuteList(): Promise<mute[]> {
        const mutes = await this.prisma.mute.findMany();
        return mutes.map(mute => ({
            ...mute,
            isFinished: mute.finished,
            isPermanent: mute.permanent,
        }));
    }

	@Cron(CronExpression.EVERY_5_MINUTES)
    async removeExpiredMutes() {
        const mutes = await this.prisma.mute.findMany();
        for (let i = 0; i < mutes.length; i++) {
            if (mutes[i].permanent)
                continue;
            if (mutes[i].duration < new Date())
                this.unmuteUser(mutes[i].channelId, mutes[i].userId);
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
                muted: {
                    connect: {
                        id: mute.id,
                    },
                },
            },
        });
        return mute;
    }

    async unmuteUser(cid: string, uid: string) {
        const muted = await this.prisma.mute.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });

        await this.prisma.mute.delete({
            where: {
                id: muted.id,
            }
        })
        return muted;
    }

    async isUserMuted(cid: string, uid: string): Promise<boolean> {
        const muted = await this.prisma.mute.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });
        return muted.finished;
    }

    async isPermanentlyMuted(cid: string, uid: string): Promise<boolean> {
        const muted = await this.prisma.mute.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });
        return muted.permanent;
    }

    async getMuteDuration(cid: string, uid: string): Promise<Date> {
        const muted = await this.prisma.mute.findFirst({
            where: {
                AND: [{ userId: uid }, { channelId: cid }],
            }
        });
        return muted.duration;       
    }
}
