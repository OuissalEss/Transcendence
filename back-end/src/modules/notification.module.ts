import { Module } from '@nestjs/common';
import { NotificationService } from "../services/notification.service";
import { NotificationResolver } from "../resolvers/notification.resolver";
import { PrismaService } from "../services/prisma.service";
import { UserService } from 'src/services/user.service';

@Module({
	providers: [NotificationService, NotificationResolver, UserService, PrismaService],
	exports: [NotificationService],
})

export class NotificationModule { }
