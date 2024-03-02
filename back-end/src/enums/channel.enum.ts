import { registerEnumType } from '@nestjs/graphql';

import { ChannelType as PrismaChannelType } from '@prisma/client'; // Import the Prisma-generated Status enum



registerEnumType(PrismaChannelType, {
    name: 'ChannelType',
    description: 'The type of the channel',
});