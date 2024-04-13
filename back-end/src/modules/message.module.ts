import { Module } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';
import {MessageResolver} from "../resolvers/message.resolver";
import {PrismaService} from "../services/prisma.service";
import { ChannelUserModule } from './channel-user.module';
import { UserModule } from './user.module';
import { ChannelModule } from './channel.module';

@Module({
  imports: [ChannelUserModule],
  providers: [MessageService, MessageResolver, PrismaService],
  exports: [MessageService],
})
export class MessageModule {}
