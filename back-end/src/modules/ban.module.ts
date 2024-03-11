import { Module, forwardRef } from '@nestjs/common';
import { BanService } from 'src/services/ban.service';
import { PrismaService } from 'src/services/prisma.service';
import { ChannelModule } from './channel.module';
@Module({
    imports: [forwardRef(() => ChannelModule)],
    providers: [
        BanService,
        PrismaService,
    ],
    exports: [BanService]
})
export class BanModule { }
