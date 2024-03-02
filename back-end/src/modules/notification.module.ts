import { Module } from '@nestjs/common';
import {NotificationService} from "../services/notification.service";
import {NotificationResolver} from "../resolvers/notification.resolver";
import {PrismaService} from "../services/prisma.service";

@Module({
    providers: [NotificationService, NotificationResolver, PrismaService]
})

export class NotificationModule {}
