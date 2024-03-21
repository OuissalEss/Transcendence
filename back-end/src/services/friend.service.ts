import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

import { Friend } from "src/entities/friend.entity";
import { CreateFriendInput } from "./dto/create-friend.input";
import { friendIncludes } from "src/includes/friend.includes";
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";

@Injectable()
export class FriendService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) { }

  /**
   * Retrieves all friends
   * @returns {Promise<Friend[]>}
   */
  async getAllFriends(): Promise<Friend[]> {
    return this.prisma.friend.findMany({
      include: friendIncludes
    });
  }

  async getFriendById(friendId: string): Promise<Friend> {
    // Check if the provided userId is a valid id
    let friendObject = this.prisma.friend.findUnique({
      where: { id: friendId },
      include: friendIncludes
    });

    if (!friendObject) throw new NotFoundException("Friend doesn't exist");

    return friendObject
  }

  async getFriendList(userId): Promise<User[]> {
    // Check if the provided userId is a valid id
    let userObject: Promise<User> = this.userService.getUserById(userId);

    if (!userObject) throw new NotFoundException("User does't exist");

    try {
      const friends: Promise<Friend[]> = this.getAllFriends();
      const friendList: User[] = [];

      (await friends).map((value: Friend, index: number) => {
        if (value.sender && value.sender.id === userId && value.isAccepted === true) {
          friendList.push(value.receiver);
        } else if (value.receiver && value.receiver.id === userId && value.isAccepted === true) {
          friendList.push(value.sender);
        }
      });

      return friendList
    } catch (e) {
      throw new ForbiddenException("Unable to retreive Friend list.");
    }
  }

  async createFriend(createFriendInput: CreateFriendInput): Promise<Friend> {
    return this.prisma.friend.create({
      data: {
        senderId: createFriendInput.senderId,
        receiverId: createFriendInput.receiverId,
        isAccepted: false,
      },
      include: friendIncludes
    });
  }

  async updateAccept(friendId: string, isAccepted: boolean): Promise<Friend> {
    // Check if the provided friendId is a valid id
    let friendObject: Promise<Friend> = this.getFriendById(friendId);

    if (!friendObject) throw new NotFoundException("Friend doesn't exist");

    try {
      return this.prisma.friend.update({
        where: { id: friendId },
        data: {
          isAccepted: isAccepted
        },
        include: friendIncludes
      })
    } catch (e) {
      throw new ForbiddenException("Unable to delete Friend.");
    }
  }

  async deleteFriend(friendId: string): Promise<Friend> {
    // Check if the provided friendId is a valid id
    let friendObject: Promise<Friend> = this.getFriendById(friendId);

    if (!friendObject) throw new NotFoundException("Friend doesn't exist");

    try {
      return this.prisma.friend.delete({
        where: { id: friendId },
        include: friendIncludes
      });
    } catch (e) {
      throw new ForbiddenException("Unable to delete Friend.");
    }
  }
}