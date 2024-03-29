import { Module } from '@nestjs/common';

import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserResolver} from "src/resolvers/user.resolver";
import { BlockModule } from './block.module';

@Module({
  imports: [BlockModule],
  providers: [UserService, UserResolver, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
