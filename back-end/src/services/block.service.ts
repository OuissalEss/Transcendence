// block.service.ts

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from 'src/entities/user.entity';
import { Block } from 'src/entities/block.entity';
import { UserService } from "./user.service";

@Injectable()
export class BlockService {
   constructor(
    private prisma: PrismaService,
    private userService: UserService
    ) {}

    async getBlockById(blockId: string): Promise<Block> {
        let blockObject = this.prisma.block.findUnique({
          where: { id: blockId },
          include: {
            blockedUser: true,
            blocker: true,
        },
        });
        if (!blockObject) throw new NotFoundException("Block doesn't exist");
        return blockObject
      }

    /**
     * Gets all block relationships for a user.
     * @param {string} userId - User ID
     * @returns {Promise<Block[]>}
     */
    async getAllBlocks(userId: string): Promise<Block[]> {
        return this.prisma.block.findMany({
            where: {
                OR: [
                    { blockerId: userId },
                    { blockedUserId: userId }
                ]
            },
            include: {
                blockedUser: true,
                blocker: true,
            },
        });
    }

    /**
    * Gets all block relationships where the user is the blocker.
    * @param {string} userId - User ID
    * @returns {Promise<Block[]>}
    */
    async getBlockedForUser(userId: string): Promise<Block[]> {
        return this.prisma.block.findMany({
            where: {
                blockerId: userId,
            },
            include: {
                blockedUser: true,
                blocker: true,
            },
        });
    }

    /**
     * Unblock a user for the specified user.
     * @param {string} userId - User ID
     * @param {string} blockId - Block's ID
     * @returns {Promise<User>}
     */
    async unblockUser(userId: string, blockId: string): Promise<Block> {
        // Check if the provided friendId is a valid id
        let userObject: User = await this.userService.getUserById(userId);
        if (!userObject) throw new NotFoundException("User doesn't exist");

        // Check if the provided blockId is a valid id
        let blockObject: Block = await this.getBlockById(blockId);
        if (!blockObject) throw new NotFoundException("Block doesn't exist");

        // Delete Block relationship
        try {
            return await this.prisma.block.delete({
                where: {
                    id: blockId,
                    blockerId: userObject.id,
                },
            });
          } catch (e) {
            throw new ForbiddenException("Unable to delete Block.");
          }
    }

}
