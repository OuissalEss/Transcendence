import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

import { Friend } from "src/entities/friend.entity";
import { CreateFriendInput } from "./dto/create-friend.input";

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all friends
   * @returns {Promise<Friend[]>}
   */
  async getAllFriends(): Promise<Friend[]> {
    return this.prisma.friend.findMany({});
  }

  async getFriendById(friendId: string): Promise<Friend> {
    return this.prisma.friend.findUnique({
      where: { id: friendId },
    });
  }
  
  async createFriend(createFriendInput: CreateFriendInput): Promise<Friend> {
    return this.prisma.friend.create({
      data: {
        senderId: createFriendInput.senderId,
        receiverId: createFriendInput.receiverId,
        isAccepted: false,
      },
    });
  }

  async updateAccept(friendId: string, isAccepted: boolean): Promise<Friend> {
    return this.prisma.friend.update({
      where: {id: friendId},
      data: {
        isAccepted: isAccepted
      }
    })
  }
  async deleteFriend(friendId: string): Promise<Friend> {
    try {
      return this.prisma.friend.delete({
        where: { id: friendId },
      });
    } catch (e) {
      throw new ForbiddenException("Unable to delete Friend.");
    }
  }
}