import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChannelUserService } from '../services/channel-user.service';
import { ChannelUser } from '../entities/channel-user.entity';
import { CreateChannelUserInput } from 'src/services/dto/create-channel-user.input';

import { UserType} from "@prisma/client";

@Resolver(() => ChannelUser)
export class ChannelUserResolver {
  constructor(private readonly channelUserService: ChannelUserService) {}

  @Query(() => [ChannelUser])
  async getAllChannelUsers(): Promise<ChannelUser[]> {
        return this.channelUserService.getAllChannelUsers();
  }

  @Query(() => ChannelUser)
  async getChannelUserById(@Args('id') id: string): Promise<ChannelUser> {
        return this.channelUserService.getChannelUserById(id);
  }
    
  @Mutation(() => ChannelUser)
  async updateChannelTypeUser(@Args('id') id: string, @Args('type') type: UserType): Promise<ChannelUser> {
      return this.channelUserService.updateChannelTypeUser(id, type);
  }
  
//  @Mutation(() => ChannelUser)
//  async createChannelUser(@Args('input') input: CreateChannelUserInput): Promise<ChannelUser> {
//        return this.channelUserService.createChannelUser(input);
//  }

  @Mutation(() => ChannelUser)
  async deleteChannelUser(@Args('id') id: string): Promise<ChannelUser> {
        return this.channelUserService.deleteChannelUser(id);
  }
}
