// notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationInput } from 'src/services/dto/create-notification.input';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) {}

    async getAllNotifications(): Promise<Notification[]> {
        return this.prisma.notification.findMany({});
    }

    async getNotificationById(notificationId: string): Promise<Notification> {
        return this.prisma.notification.findUnique({
            where: { id: notificationId },
        });
    }

    async createNotification(createNotificationInput: CreateNotificationInput): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                time: createNotificationInput.time,
                type: createNotificationInput.type,
                isRead: createNotificationInput.isRead,
                senderId: createNotificationInput.senderId,
                receiverId: createNotificationInput.receiverId,
            },
        });
    }

    // Additional methods can be added based on your requirements
}
