import { registerEnumType } from '@nestjs/graphql';

import { NotifType as PrismaNotificationType } from '@prisma/client'; // Import the Prisma-generated Status enum


registerEnumType(PrismaNotificationType, {
    name: 'NotificationType',
    description: 'The type of the notification',
});