import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Channel } from 'src/entities/channel.entity';
import { CreateChannelInput } from 'src/services/dto/create-channel.input';
import { ChannelService } from 'src/services/channel.service';
import { ChannelType } from '@prisma/client';
import { User } from 'src/entities/user.entity';
import { BanService } from 'src/services/ban.service';
import { MuteService } from 'src/services/mute.service';
import { Message } from 'src/entities/message.entity';
import { MessageService } from 'src/services/message.service';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly channelService: ChannelService,
    private readonly banService: BanService,
    private readonly muteService: MuteService,
    private readonly messageService: MessageService
  ) {}

  @Query(() => [Channel], {
    name:'AllChannels',
    description: 'Get all channels'
  })
  async getAllChannels(): Promise<Channel[]> {
        return this.channelService.getAllChannels();
  }

  @Query(() => Channel, {
    name: "ChannelById",
    description: 'Get a channel by ID'
  })
  async getChannelById(@Args('id', {type: () => String}) id: string): Promise<Channel> {
        return this.channelService.getChannelById(id);
  }

  @Query(() => Channel, {
    name: "ChannelByTitle",
    description: 'Get a channel by title'
  })
  async getChannelByTitle(@Args('title', {type: () => String}) title: string): Promise<Channel> {
        return this.channelService.getChannelByTitle(title);
  }

  @Query(() => [Channel], {
    name: "ChannelByType",
    description: 'Get a channel by type'
  })
  async getChannelByType(@Args('type', {type: () => String}) type: string): Promise<Channel[]> {
        return this.channelService.getChannelByType(type as ChannelType);
  }

  @Query(() => [User], {
    name: "Owner",
    description: 'Get a channel owner'
  })
  async getChannelOwner(@Args('owner', {type: () => String}) owner: string): Promise<User> {
        return this.channelService.getChannelOwner(owner);
  }

  @ResolveField(() => [User], {
    name: "members",
    description: 'Get a channel members'
  })
  async getChannelMembers(@Parent() channel: Channel): Promise<User[]> {
        const cid = channel.id as string;
        return this.channelService.getChannelMembers(cid);
  }

  @ResolveField(() => [User], {
    name: "admins",
    description: 'Get a channel admins'
  })
  async getChannelAdmins(@Parent() channel: Channel): Promise<User[]> {
        const cid = channel.id as string;
        return this.channelService.getChannelAdmins(cid);
  }

  @ResolveField(() => [User], {
    name: "banned",
    description: 'Get a channel banned users'
  })
  async getChannelBanned(@Parent() channel: Channel): Promise<User[]> {
        const cid = channel.id as string;
        return this.banService.getBannedUserListByCid(cid);
  }

  @ResolveField(() => [User], {
    name: "muted",
    description: 'Get a channel muted users'
  })
  async getChannelMuted(@Parent() channel: Channel): Promise<User[]> {
        const cid = channel.id as string;
        return this.muteService.getMutedUserListCid(cid);
  }

  @ResolveField(() => User, {
    name: "owner",
    description: 'Get a channel owner'
  })
  async getOwner(@Parent() channel: Channel): Promise<User> {
        const cid = channel.id as string;
        return this.channelService.getChannelOwner(cid);
  }


  @ResolveField(() => [Message], {
    name: "messages",
    description: 'Get a channel messages'
  })
  async getChannelMessages(@Parent() channel: Channel): Promise<Message[]> {
        const cid = channel.id as string;
        return this.messageService.getAllMessagesByChannelId(cid);
  }

  @Query(() => [Channel], {
    name: "Description",
    description: 'Get a channel by description'
  })
  async getChannelDescription(@Args('description', {type: () => String}) description: string): Promise<string> {
        return this.channelService.getChannelDescription(description);
  }

  @Query(() => [Channel], {
    name: "ownedChannels",
    description: 'Get all channels by owner'
  })
  async getChannelsByOwner(@Args('owner', {type: () => String}) owner: string): Promise<Channel[]> {
        return this.channelService.getChannelsByOwner(owner);
  }

  @Query(() => [Channel], {
    name: "ProfileImage",
    description: 'Get a channel by profile image'
  })
  async getChannelProfileImage(@Args('profileImage', {type: () => String}) profileImage: string): Promise<string> {
        return this.channelService.getChannelProfileImage(profileImage);
  }

 @Mutation(() => Channel, {
   name: "createChannel",
   description: 'Create a new channel'
 })
 async createChannel(@Args('createChannelInput', {type: () => CreateChannelInput}) createChannelInput: CreateChannelInput): Promise<Channel> {
       return this.channelService.createChannel(createChannelInput);
 }

  @Mutation(() => User, {
    name: "addAdmin",
    description: 'Add an admin to a channel'
  })
  async addAdmin(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.addAdmin(cid, uid);
  }

  @Mutation(() => Channel, {
    name: "removeAdmin",
    description: 'Remove an admin from a channel'
  })
  async removeAdmin(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.removeAdmin(cid, uid);
  }

  @Mutation(() => User, {
    name: "addMember",
    description: 'Add a member to a channel'
  })
  async addMember(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.addMember(cid, uid);
  }

  @Mutation(() => Channel, {
    name: "removeMember",
    description: 'Remove a member from a channel'
  })
  async removeMember(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.removeMember(cid, uid);
  }

  @Mutation(() => Channel, {
    name: "updateChannelTitle",
    description: 'Update a channel title'
  })
  async updateChannelTitle(
    @Args('cid', {type: () => String}) cid: string,
    @Args('title', {type: () => String}) title: string,
  ) {
        return this.channelService.updateChannelTitle(cid, title);
  }

  @Mutation(() => Channel, {
    name: "updateChannelType",
    description: 'Update a channel type'
  })
  async updateChannelType(
    @Args('cid', {type: () => String}) cid: string,
    @Args('type', {type: () => ChannelType}) type: ChannelType,
  ) {
        return this.channelService.updateChannelType(cid, type);
  }

  @Mutation(() => Channel, {
    name: "updateChannelDescription",
    description: 'Update a channel description'
  })
  async updateChannelDescription(
    @Args('cid', {type: () => String}) cid: string,
    @Args('description', {type: () => String}) description: string,
  ) {
        return this.channelService.updateChannelDescription(cid, description);
  }

  @Mutation(() => Channel, {
    name: "deleteChannel",
    description: 'Delete a channel'
  })
  async deleteChannel(
    @Args('cid', {type: () => String}) cid: string,
  ) {
        return this.channelService.deleteChannel(cid);
  }

  @Mutation(() => Channel, {
    name: "updateChannelPassword",
    description: 'Update a channel password'
  })
  async updateChannelPassword(
    @Args('cid', {type: () => String}) cid: string,
    @Args('password') password?: string,
  ) {
        return this.channelService.updateChannelPassword(cid, password);
  }

  @Mutation(() => Channel, {
    name: "updateChannelProfileImage",
    description: 'Update a channel profile image'
  })
  async updateChannelProfileImage(
    @Args('cid', {type: () => String}) cid: string,
    @Args('profileImage', {type: () => String}) profileImage: string,
  ) {
        return this.channelService.updateChannelProfileImage(cid, profileImage);
  }

  @Mutation(() => Channel, {
    name: "joinChannel",
    description: 'Join a channel'
  })
  async joinChannel(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.joinChannel(cid, uid);
  }

  @Mutation(() => User, {
    name: "leaveChannel",
    description: 'Leave a channel'
  })
  async leaveChannel(
    @Args('cid', {type: () => String}) cid: string,
    @Args('uid', {type: () => String}) uid: string,
  ) {
        return this.channelService.leaveChannel(cid, uid);
  }


  // @Mutation(() => Channel, {
  //   name: "banUser",
  //   description: 'Ban a user from a channel'
  // })
  // async banUser(
  //   @Args('cid') cid: string,
  //   @Args('uid') uid: string,
  // ) {
  //       return this.channelService.banUser(cid, uid);
  // }

  // @Mutation(() => Channel, {
  //   name: "unbanUser",
  //   description: 'Unban a user from a channel'
  // })
  // async unbanUser(
  //   @Args('cid') cid: string,
  //   @Args('uid') uid: string,
  // ) {
  //       return this.channelService.unbanUser(cid, uid);
  // }

  // @Mutation(() => Channel, {
  //   name: "muteUser",
  //   description: 'Mute a user from a channel'
  // })
  // async muteUser(
  //   @Args('cid') cid: string,
  //   @Args('uid') uid: string,
  //   @Args('duration') duration: Date,
  //   @Args('permanent') permanent: boolean,
  // ) {
  //       return this.channelService.muteUser(cid, uid, duration, permanent);
  // }

  // @Mutation(() => Channel, {
  //   name: "unmuteUser",
  //   description: 'Unmute a user from a channel'
  // })
  // async unmuteUser(
  //   @Args('cid') cid: string,
  //   @Args('uid') uid: string,
  // ) {
  //       return this.channelService.unmuteUser(cid, uid);
  // }
}
