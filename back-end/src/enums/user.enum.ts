import { registerEnumType } from '@nestjs/graphql';

import { UserType as PrismaUserType } from '@prisma/client'; // Import the Prisma-generated Status enum


registerEnumType(PrismaUserType, {
    name: 'UserType',
    description: 'The type of the user',
});