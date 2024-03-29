import { BlockController } from './../controllers/block.controller';
import { Module } from '@nestjs/common';
import { BlockService } from "../services/block.service";
import { BlockResolver } from "../resolvers/block.resolver";
import { PrismaService } from "../services/prisma.service";
import { UserService } from 'src/services/user.service';


@Module({
    providers: [BlockService, BlockResolver, UserService, PrismaService],
    controllers: [
        BlockController, BlockController],
    exports: [BlockService]
})
export class BlockModule { }