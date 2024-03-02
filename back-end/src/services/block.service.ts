//// block.service.ts
//
//import { Injectable } from '@nestjs/common';
//import { PrismaService } from './prisma.service';
//import { User } from 'src/entities/user.entity';
//import { Block } from 'src/entities/block.entity';
//
//@Injectable()
//export class BlockService {
//    constructor(private prisma: PrismaService) {}
//
//    /**
//   * Gets all block relationships for a user.
//   * @param {number} userId - User ID
//   * @returns {Promise<Block[]>}
//   */
//  async getBlocksForUser(userId: number): Promise<Block[]> {
//        return this.prisma.block.findMany({
//            where: {
//                OR: [
//                    { blocking: { id_u: userId } },
//                    { blocked: { id_u: userId } },
//                    ],
//            },
//            include: {
//                blocking: true,
//                blocked: true,
//            },
//        });
//    }
//
//    /**
//   * Unblock a user for the specified user.
//   * @param {number} userId - User ID
//   * @param {number} blockedUserId - Blocked user's ID
//   * @returns {Promise<User>}
//   */
//  async unblockUser(userId: number, blockedUserId: number): Promise<User> {
//        const blockingUser = await this.prisma.user.findUnique({
//            where: { id_u: userId },
//        });
//        const blockedUser = await this.prisma.user.findUnique({
//            where: { id_u: blockedUserId },
//        });
//
//        // Delete Block relationship
//        await this.prisma.block.deleteMany({
//            where: {
//                OR: [
//                    { blockingId: blockingUser.id_u, blockedId: blockedUser.id_u },
//                    { blockingId: blockedUser.id_u, blockedId: blockingUser.id_u },
//                    ],
//            },
//        });
//
//        // You can add additional logic here based on your requirements
//
//        return this.prisma.user.findUnique({
//            where: { id_u: userId },
//        });
//    }
//
//    // You can add more functions here based on your requirements
//}
