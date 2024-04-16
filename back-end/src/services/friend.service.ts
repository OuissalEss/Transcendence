import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

import { Friend } from "src/entities/friend.entity";
import { CreateFriendInput } from "./dto/create-friend.input";
import { friendIncludes } from "src/includes/friend.includes";
import { User } from "src/entities/user.entity";
import { UserService } from "./user.service";
import { AchievementService } from "./user_achievement.service";
import { Achievement } from "@prisma/client";
import { NotificationService } from "./notification.service";
import { CreateNotificationInput } from "./dto/create-notification.input";
import { NotifType as NotificationType } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private achievementService: AchievementService,
    private notificationService: NotificationService,
  ) { }

  /**
   * Retrieves all friends
   * @returns {Promise<Friend[]>}
   */
  async getAllFriends(): Promise<Friend[]> {
    try {
      return this.prisma.friend.findMany({
        include: friendIncludes
      });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  }

  async getFriendById(friendId: string): Promise<Friend> {
    try {
      // Check if the provided userId is a valid id
      let friendObject = await this.prisma.friend.findUnique({
        where: {
          id: friendId
        },
        include: friendIncludes
      });

      if (!friendObject) throw new NotFoundException("Friend doesn't exist");

      return friendObject
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  }

  async getFriendList(userId): Promise<User[]> {
    try {
      // Check if the provided userId is a valid id
      let userObject: User = await this.userService.getUserById(userId);

      if (!userObject) throw new NotFoundException("User does't exist");

      const friends: Friend[] = await this.getAllFriends();
      const friendList: User[] = [];

      friends.map((value: Friend, index: number) => {
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

  async getFriendSender(userId): Promise<Friend[]> {
    try {
    // Check if the provided userId is a valid id
    let userObject: User = await this.userService.getUserById(userId);
    if (!userObject) throw new NotFoundException("User does't exist");
      const friendSender: Friend[] = await this.prisma.friend.findMany({
        where: {
          senderId: userObject.id
        },
        include: friendIncludes
      });

      return friendSender
    } catch (e) {
      throw new ForbiddenException("Unable to retreive Friend list where the user is the sender.");
    }
  }

  async getFriendReceiver(userId): Promise<Friend[]> {
    try {
    // Check if the provided userId is a valid id
    let userObject: User = await this.userService.getUserById(userId);
    if (!userObject) throw new NotFoundException("User does't exist");
      const friendReceiver: Friend[] = await this.prisma.friend.findMany({
        where: {
          receiverId: userObject.id
        },
        include: friendIncludes
      });

      return friendReceiver
    } catch (e) {
      throw new ForbiddenException("Unable to retreive Friend list where the user is the receiver.");
    }
  }

  async createFriend(createFriendInput: CreateFriendInput): Promise<Friend> {
    try {
      const createdFriendShip = this.prisma.friend.create({
        data: {
          senderId: createFriendInput.senderId,
          receiverId: createFriendInput.receiverId,
          isAccepted: false,
        },
        include: friendIncludes
      });
      const notifData: CreateNotificationInput = {
        type: NotificationType.FRIEND_REQUEST,
        isRead: false,
        senderId: createFriendInput.senderId,
        receiverId: createFriendInput.receiverId,
      }
      this.notificationService.createNotification(notifData);
      return createdFriendShip;
    } catch (e) {
      throw new ForbiddenException("Unable to create FriendShip");
    }
  }

  async updateAccept(userId: string, friendId: string): Promise<Friend> {
    try {
    // Check if the provided friendId is a valid id
    let userObject: User = await this.userService.getUserById(userId);
    if (!userObject) throw new NotFoundException("User doesn't exist");

    // Check if the provided friendId is a valid id
    let friendObject: Friend = await this.getFriendById(friendId);
    if (!friendObject) throw new NotFoundException("Friend doesn't exist");
      const friendship = await this.prisma.friend.update({
        where: {
          id: friendId,
          receiverId: userObject.id,
        },
        data: {
          isAccepted: true
        },
        include: friendIncludes
      });
      const id_receiver = friendship.receiverId;
      const id_sender = friendship.senderId;
      this.userService.addXp(id_receiver, 100);
      this.userService.addXp(id_sender, 100);
      let friendsOfReceiver = await this.getFriendList(id_receiver);
      let friendsOfSender = await this.getFriendList(id_sender);
      if (friendsOfReceiver.length == 1) {
        await this.achievementService.createAchievement(id_receiver, Achievement.social);
      }
      if (friendsOfSender.length == 1) {
        await this.achievementService.createAchievement(id_sender, Achievement.social);
      }
      return friendship;
    } catch (e) {
      throw new ForbiddenException("Unable to delete Friend.");
    }
  }

  async deleteFriend(userId: string, friendId: string): Promise<Friend> {
    try {
    // Check if the provided friendId is a valid id
    let userObject: User = await this.userService.getUserById(userId);
    if (!userObject) throw new NotFoundException("User doesn't exist");

    // Check if the provided friendId is a valid id
    let friendObject: Friend = await this.getFriendById(friendId);
    if (!friendObject) throw new NotFoundException("Friend doesn't exist");

    console.log(userId, friendId);
      return this.prisma.friend.delete({
        where: {
          id: friendId,
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: friendIncludes
      });
    } catch (e) {
      throw new ForbiddenException("Unable to delete Friend.");
    }
  }
}