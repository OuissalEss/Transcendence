import { registerEnumType } from '@nestjs/graphql';

import { Status as PrismaStatus } from '@prisma/client'; // Import the Prisma-generated Status enum


// Register the PrismaStatus enum with GraphQL
registerEnumType(PrismaStatus, {
    name: 'Status',
    description: 'The type of the user status.',
});