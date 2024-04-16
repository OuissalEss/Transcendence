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
    ) { }

    async getBlockById(blockId: string): Promise<Block> {
        try {
            let blockObject = this.prisma.block.findUnique({
                where: { id: blockId },
                include: {
                    blockedUser: {
                        include: {
                            avatar: true,
                        }
                    },
                    blocker: {
                        include: {
                            avatar: true,
                        }
                    },
                },
            });
            if (!blockObject) throw new NotFoundException("Block doesn't exist");
            return blockObject
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Gets all block relationships for a user.
     * @param {string} userId - User ID
     * @returns {Promise<Block[]>}
     */
    async getAllBlocks(userId: string): Promise<Block[]> {
        try {
            return this.prisma.block.findMany({
                where: {
                    OR: [
                        { blockerId: userId },
                        { blockedUserId: userId }
                    ]
                },
                include: {
                    blockedUser: {
                        include: {
                            avatar: true,
                        }
                    },
                    blocker: {
                        include: {
                            avatar: true,
                        }
                    },
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
    * Gets all block relationships where the user is the blocker.
    * @param {string} userId - User ID
    * @returns {Promise<Block[]>}
    */
    async getBlockedForUser(userId: string): Promise<Block[]> {
        try {
            return this.prisma.block.findMany({
                where: {
                    blockerId: userId,
                },
                include: {
                    blockedUser: {
                        include: {
                            avatar: true,
                        }
                    },
                    blocker: {
                        include: {
                            avatar: true,
                        }
                    },
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Unblock a user for the specified user.
     * @param {string} userId - User ID
     * @param {string} blockId - Block's ID
     * @returns {Promise<User>}
     */
    async unblockUser(userId: string, blockId: string): Promise<Block> {
        try {
            // Check if the provided friendId is a valid id
            let userObject: User = await this.userService.getUserById(userId);
            if (!userObject) throw new NotFoundException("User doesn't exist");

            // Check if the provided blockId is a valid id
            let blockObject: Block = await this.getBlockById(blockId);
            if (!blockObject) throw new NotFoundException("Block doesn't exist");

            // Delete Block relationship
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

    async getBlockenListByUid(uid: string): Promise<Block[]> {
        try {
            return await this.prisma.block.findMany({
                where: {
                    blockedUserId: uid,
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getBlockedListByUid(uid: string): Promise<Block[]> {
        try {
            return await this.prisma.block.findMany({
                where: {
                    blockerId: uid,
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // get all the blocks
    async getBlockList(): Promise<Block[]> {
        try {
            return await this.prisma.block.findMany();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async blockUser(blockerId: string, blockedUserId: string): Promise<User> {
        try {
            // if (!this.isBlocked(blockerId, blockedUserId)) {
            await this.prisma.block.create({
                data: {
                    blockerId: blockerId,
                    blockedUserId: blockedUserId,
                },
            });
            // }

            return this.prisma.user.findUnique({
                where: {
                    id: blockedUserId,
                },
                include: {
                    avatar: true,
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async isBlocked(blockerId: string, blockedUserId: string): Promise<boolean> {
        try {
            const block = await this.prisma.block.findFirst({
                where: {
                    blockerId: blockerId,
                    blockedUserId: blockedUserId,
                },
            });
            return block != null;
        } catch (error) {
            console.error('Error:', error);
        }
    }

}
