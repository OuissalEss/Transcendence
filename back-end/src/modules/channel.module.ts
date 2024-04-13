import { Module, forwardRef } from '@nestjs/common';
import { ChannelService } from 'src/services/channel.service';
import { ChannelResolver } from 'src/resolvers/channel.resolver';
import { PrismaService } from 'src/services/prisma.service';
import { ChannelController } from 'src/controllers/channel.controller';
import { ChannelUserService } from 'src/services/channel-user.service'; // Example additional service module
import { MuteService } from 'src/services/mute.service'; // Example additional service module
import { BanService } from 'src/services/ban.service';
import { ChannelUserModule } from './channel-user.module';
import { MuteModule } from './mute.module';
import { BanModule } from './ban.module';
import { MessageModule } from './message.module';

@Module({
    imports: [
        ChannelUserModule, // Include additional services here
        MuteModule, // Include additional services here
        forwardRef(() => BanModule),
        MessageModule,
    ],
    providers: [
        ChannelService,
        ChannelResolver,
        PrismaService,
    ],
    controllers: [ChannelController],
    exports: [ChannelService],
})
export class ChannelModule {}
