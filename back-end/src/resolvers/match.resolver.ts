// match.resolver.ts
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserInput } from "../services/dto/update-user.input";
import { NotFoundException, Req } from "@nestjs/common";
import { Status } from '@prisma/client'; // Import the Prisma-generated Status enum
import { Request } from 'express';
import { Payload } from 'src/services/types/auth.service';
import { MatchService } from "../services/match.service";
import { Match } from "../entities/match.entity";
import { CreateMatchInput } from "../services/dto/create-match.input";

@Resolver(of => ('Match'))
export class MatchResolver {
	constructor(
		private readonly matchService: MatchService,
		private readonly userService: UserService,
	) {
	}

	@Query(() => [Match], {
		name: "getAllMatches",
		description: "Retrieves all matches associated with a specific user.",
	})
	async getAllMatches(@Args('userId') userId: string) {
		// console.log("matchs = ", this.matchService.getAllUserMatchs(userId))
		return this.matchService.getAllUserMatchs(userId);
	}

	@Query(() => Match, {
		name: "getMatchById",
		description: "Retrieves a specific match by its ID.",
	})
	async getMatchById(@Args('id') id: string) {
		return this.matchService.getMatchById(id);
	}

	@Mutation(() => Match, {
		name: "updateHostScore",
		description: "Updates the score of the host in a match.",
	})
	async updateHostScore(@Args('matchId') matchId: string, @Args('host_score') host_score: number) {
		return this.matchService.updateHostScore(matchId, host_score);
	}

	@Mutation(() => Match, {
		name: "updateGuestScore",
		description: "Updates the score of the guest in a match.",
	})
	async updateGuestScore(@Args('matchId') matchId: string, @Args('guest_score') guest_score: number) {
		return this.matchService.updateGuestScore(matchId, guest_score);
	}

	@Mutation(() => Match, {
		name: "updateMatchWinner",
		description: "Updates the winner of a match.",
	})
	async updateMatchWinner(@Args('matchId') matchId: string, @Args('match_winner') match_winner: string) {
		return this.matchService.updateMatchWinner(matchId, match_winner);
	}

	@Mutation(() => Match, {
		name: "createMatch",
		description: "Creates a new match.",
	})
	async createMatch(@Args('createMatchInput') createMatchInput: CreateMatchInput): Promise<Match> {
		return this.matchService.createMatch(createMatchInput);
	}
}
