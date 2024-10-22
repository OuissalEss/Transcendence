// notification.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationInput } from 'src/services/dto/create-notification.input';
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";

@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
    ) { }

    async getAllNotifications(): Promise<Notification[]> {
        try {
            return await this.prisma.notification.findMany({});
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getNotificationById(notificationId: string): Promise<Notification> {
        try {
            return await this.prisma.notification.findUnique({
                where: {
                    id: notificationId
                },
                include: {
                    sender: {
                        include: {
                            avatar: true,
                        }
                    },
                    receiver: {
                        include: {
                            avatar: true,
                        }
                    },
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        try {
            let userObject: User = await this.userService.getUserById(userId);
            if (!userObject) throw new NotFoundException("User doesn't exist");

            const notifs = await this.prisma.notification.findMany({
                where: {
                    receiverId: userId
                },
                include: {
                    sender: {
                        include: {
                            avatar: true,
                        }
                    },
                    receiver: {
                        include: {
                            avatar: true,
                        }
                    },
                }
            });
            return notifs;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async createNotification(createNotificationInput: CreateNotificationInput): Promise<Notification> {
        try {
            return await this.prisma.notification.create({
                data: {
                    time: new Date(),
                    type: createNotificationInput.type,
                    isRead: createNotificationInput.isRead,
                    senderId: createNotificationInput.senderId,
                    receiverId: createNotificationInput.receiverId,
                    inviteCode: createNotificationInput.inviteCode,
                },
            });
        } catch (e) {
            throw new ForbiddenException("Unable to create Notification");
        }
    }

    async updateIsRead(userId: string, notificationId: string): Promise<Notification> {
        try {
            let userObject: User = await this.userService.getUserById(userId);
            if (!userObject) throw new NotFoundException("User doesn't exist");

            let notifObject: Notification = await this.getNotificationById(notificationId);
            if (!notifObject) throw new NotFoundException("Notification doesn't exist");

            const updatedNotif = await this.prisma.notification.update({
                where: {
                    id: notificationId,
                    receiverId: userId,
                },
                data: {
                    isRead: true,
                },
                include: {
                    sender: {
                        include: {
                            avatar: true,
                        }
                    },
                    receiver: {
                        include: {
                            avatar: true,
                        }
                    },
                }
            });
            return updatedNotif;
        } catch (e) {
            throw new ForbiddenException("Unable to update Notification.");
        }
    }
}
