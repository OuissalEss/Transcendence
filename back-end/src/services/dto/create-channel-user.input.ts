import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ChannelUser } from 'src/entities/channel-user.entity';
import { ChannelType as PrismaChannelType } from '@prisma/client'; // Update import


import { UserType } from '@prisma/client'; // Import the Prisma-generated UserType enum
import { Message } from 'src/entities/message.entity';

@InputType()
export class CreateChannelUserInput {
  /**
   * The unique identifier of the channel user.
   * @type {number}
   */
  @Field(() => String)
  @IsString({ message: 'Channel User ID must be a string' })
  @IsNotEmpty({ message: 'Channel User ID cannot be empty' })
  id: string;

  /**
   * The user who initiated the block.
   * @type {User}
   */
  @Field(() => String, { description: 'User IDr' })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  userId: string;

  /**
   * The user who initiated the block.
   * @type {User}
   */
  @Field(() => String, { description: 'Channel ID' })
  @IsString({ message: 'Channel ID must be a string' })
  @IsNotEmpty({ message: 'Channel ID cannot be empty' })
  channelId: string;

  /**
   * Type of user in the channel.
   * @type {UserType}
   */
  @Field(() => UserType, { description: 'Type of user in the channel' })
  @IsEnum(UserType, { message: 'Invalid user type' })
  type: UserType;

  /**
   * Messages sent by the user in the channel.
   * @type {Message[]}
   */
  @Field(() => [Message], { description: 'Messages sent by the user in the channel' })
  message: Message[];
  
}
