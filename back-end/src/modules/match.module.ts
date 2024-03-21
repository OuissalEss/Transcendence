import { Module } from '@nestjs/common';

import { MatchService } from 'src/services/match.service';
import { PrismaService } from 'src/services/prisma.service';
import { MatchResolver} from "src/resolvers/match.resolver";
import { UserService } from 'src/services/user.service';

@Module({
  providers: [UserService, MatchService, MatchResolver, PrismaService],
  controllers: [],
})
export class MatchModule {}
