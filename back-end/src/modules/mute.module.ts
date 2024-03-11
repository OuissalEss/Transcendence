import { Module } from '@nestjs/common';
import { MuteResolver } from 'src/resolvers/mute.resolver';
import { MuteService } from 'src/services/mute.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    providers: [
        MuteService,
        PrismaService,
        MuteResolver,
    ],
    exports: [MuteService]
})
export class MuteModule { }
