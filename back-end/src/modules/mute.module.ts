import { Module } from '@nestjs/common';
import { MuteService } from 'src/services/mute.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    providers: [MuteService, PrismaService],
    exports: [MuteService]
})
export class MuteModule { }
