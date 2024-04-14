import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { PrismaService } from './prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { mute } from 'src/entities/mute.entity';

type MuteWhereUniqueInput = {
    userId_channelId: {
        userId: string;
        channelId: string;
    };
};

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
                include: {
                    avatar: true,
                }
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
                include: {
                    avatar: true,
                }
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

	@Cron(CronExpression.EVERY_7_HOURS)
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
        try {
            // const mute = await this.prisma.mute.upsert({
            //     where: {
            //         userId_channelId: {
            //             userId: uid,
            //             channelId: cid,
            //         },fqhwad
            //     },
            //     create: {
            //         userId: uid,
            //         channelId: cid,
            //         duration: duration,
            //         finished: false,
            //         permanent: permanent,
            //     },
            //     update: {
            //         duration: duration,
            //         finished: false,
            //         permanent: permanent,
            //     },
            //     include: {
            //         user: true, // Include the user in the result
            //     },
            // });

            // Check if the mute record already exists
            const existingMute = await this.prisma.mute.findFirst({
                where: {
                    userId: uid,
                    channelId: cid,
                },
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: uid,
                },
            });

            if (existingMute) {
                // If the mute record exists, update it
                const updatedMute = await this.prisma.mute.update({
                    where: {
                        id: existingMute.id, // Use the unique ID to update
                    },
                    data: {
                        duration: duration,
                        finished: false,
                        permanent: permanent,
                    },
                });
            } else {
                // If the mute record doesn't exist, create a new one
                const newMute = await this.prisma.mute.create({
                    data: {
                        userId: uid,
                        channelId: cid,
                        duration: duration,
                        finished: false,
                        permanent: permanent,
                    },
                });
            }
            return user;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async unmuteUser(cid: string, uid: string) {
        try {
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
            return await this.prisma.user.findUnique({
                where: {
                    id: uid,
                },
            });
        } catch (e) {
            this.logger.error(e);
        }
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
