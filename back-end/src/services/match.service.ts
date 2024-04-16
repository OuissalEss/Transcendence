// match.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { CreateMatchInput } from './dto/create-match.input';
import { Match } from "src/entities/match.entity";

import { matchIncludes } from "../includes/match.includes";


@Injectable()
export class MatchService {
    constructor(private prisma: PrismaService) { }

    /**
     * Retrieves all user matchs.
     * @param {number} userId - host ID
     * @returns {Promise<Match[]>}
     */
    async getAllUserMatchs(userId: string): Promise<Match[]> {
        try {
            console.log("USER ID = ", userId);
            console.log("*******************************************");
            const match = await this.prisma.match.findMany({
                where: {
                    OR: [{ hostId: userId }, { guestId: userId }]
                },
                include: matchIncludes,
            });
            console.log("MATCH = ", match);
            if (!match) throw new NotFoundException("Match not found");
            return match;
        } catch (error) {
            throw new Error(`Error fetching matches: ${error.message}`);
        }
    }

    /**
     * Retrieves a specific match by ID.
     * @param {number} id - Match ID
     * @returns {Promise<Match>}
     */
    async getMatchById(id: string): Promise<Match> {
        try {
            const match = await this.prisma.match.findUnique({
                where: {
                    id: id
                },
                include: matchIncludes,
            });
            if (!match) throw new NotFoundException("Match not found");
            return match;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Updates a match's information.
     * @param {number} matchId - Match ID
     * @param {number} hostScore - Host's score to update
     * @returns {Promise<Match>}
     */
    async updateHostScore(matchId: string, host_score: number): Promise<Match> {
        try {
            let matchObject: Promise<Match> = this.getMatchById(matchId);
            if (!matchObject) throw new NotFoundException("Match does't exist");

            return this.prisma.match.update({
                where: { id: matchId },
                data: { host_score_m: host_score },
                include: matchIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Matchscores");
        }
    }

    /**
     * Updates a match's information.
     * @param {number} matchId - Match ID
     * @param {number} guestScore - Guest's score to update
     * @returns {Promise<Match>}
     */
    async updateGuestScore(matchId: string, guest_score: number): Promise<Match> {
        try {
            let matchObject: Promise<Match> = this.getMatchById(matchId);
            if (!matchObject) throw new NotFoundException("Match does't exist");

            return this.prisma.match.update({
                where: { id: matchId },
                data: { guest_score_m: guest_score },
                include: matchIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update Matchscores");
        }
    }

    /**
     * Updates a match's winner.
     * @param {string} matchId - Match ID
     * @param {string} match_winner - winner id to update
     * @returns {Promise<Match>} Updated match object
    */
    async updateMatchWinner(matchId: string, match_winner: string): Promise<Match> {
        try {
            let matchObject: Promise<Match> = this.getMatchById(matchId);
            if (!matchObject) throw new NotFoundException("Match does't exist");

            return this.prisma.match.update({
                where: { id: matchId },
                data: { winnerId: match_winner },
                include: matchIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update winner");
        }
    }
    /**
     * Updates a match's loser.
     * @param {string} matchId - Match ID
     * @param {string} match_loser - loser id to update
     * @returns {Promise<Match>} Updated match object
    */
    async updateMatchLoser(matchId: string, match_loser: string): Promise<Match> {
        try {
            let matchObject: Promise<Match> = this.getMatchById(matchId);
            if (!matchObject) throw new NotFoundException("Match does't exist");

            return this.prisma.match.update({
                where: { id: matchId },
                data: { loserId: match_loser },
                include: matchIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to update loser");
        }
    }



    async createMatch(createMatchInput: CreateMatchInput): Promise<Match> {
        try {
            return this.prisma.match.create({
                data: {
                    host_score_m: createMatchInput.host_score_m,
                    guest_score_m: createMatchInput.guest_score_m,
                    hostId: createMatchInput.hostId,
                    guestId: createMatchInput.guestId,
                    start_m: new Date(),
                },
                include: matchIncludes,
            });
        } catch (e) {
            throw new ForbiddenException("Unable to create match.");
        }
    }


    /**
     * Deletes a match and their associated data.
     *
     * @param {string} matchId - The ID of the match to delete.
     * @returns {Promise<Match>} A promise that resolves to the deleted match.
     * @throws {ForbiddenException} If the match cannot be deleted.
     */
    async deleteMatch(matchId: string): Promise<Match> {
        try {
            const deletedMatch = await this.prisma.match.delete({
                where: { id: matchId },
                include: matchIncludes
            });
            return deletedMatch;
        } catch (e) {
            throw new ForbiddenException("Unable to delete Match.");
        }
    }
}
