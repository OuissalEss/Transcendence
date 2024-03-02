import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Channel } from 'src/entities/channel.entity';
import { CreateChannelInput } from 'src/services/dto/create-channel.input';
import { ChannelService } from 'src/services/channel.service';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [Channel], {
    name:'getAllChannels',
    description: 'Get all channels'
  })
  async getAllChannels(): Promise<Channel[]> {
        return this.channelService.getAllChannels();
  }

  @Query(() => Channel, {
    name: "getChannelById",
    description: 'Get a channel by ID'
  })
  async getChannelById(@Args('id') id: string): Promise<Channel> {
        return this.channelService.getChannelById(id);
  }

//  @Mutation(() => Channel, {
//    name: "createChannel",
//    description: 'Create a new channel'
//  })
//  async createChannel(@Args('createChannelInput') createChannelInput: CreateChannelInput): Promise<Channel> {
//        return this.channelService.createChannel(createChannelInput);
//  }
}
