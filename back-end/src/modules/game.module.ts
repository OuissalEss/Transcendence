import { Module } from "@nestjs/common";
import { GameGateway } from "../gateway/game.gateway";
import { MatchService } from "src/services/match.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
	providers: [GameGateway, MatchService, PrismaService],
})
export class GameModule {
}