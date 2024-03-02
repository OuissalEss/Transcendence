import { Module } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';
import {MessageResolver} from "../resolvers/message.resolver";
import {PrismaService} from "../services/prisma.service";

@Module({
  providers: [MessageService, MessageResolver, PrismaService]
})
export class MessageModule {}
