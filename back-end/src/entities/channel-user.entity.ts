// channel-user.entity.ts
import { Field, ObjectType, ID, registerEnumType} from '@nestjs/graphql';
import {IsInt, IsEnum, IsNotEmpty, IsDate, IsString} from 'class-validator';
//import { UserType } from 'src/enums/user.enum';
import { Channel } from './channel.entity';
import { User } from "./user.entity";
import { Message } from './message.entity';


import { UserType } from '@prisma/client'; // Import the Prisma-generated UserType enum

@ObjectType()
export class ChannelUser {
  /**
   * The unique identifier of the channel user.
   * @type {number}
   */
  @Field(() => ID)
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
  channelId: String;

  /**
   * Type of user in the channel.
   * @type {UserType}
   */
  @Field(() => UserType, {
   defaultValue: "USER",
   description: 'Type of user in the channel'
  })
  @IsEnum(UserType, { message: 'Invalid user type' })
  type: UserType;

  /**
   * Messages sent by the user in the channel.
   * @type {Message[]}
   */
  @Field(() => [Message], { description: 'Messages sent by the user in the channel' })
  message?: Message[];

  /**
   * The date when the channel user was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel User created at must not be empty' })
  @IsDate({ message: 'Channel User created at must be a date' })
  @Field(() => Date, { description: 'Date the channel user was created' })
  createdAt: Date;

  /**
   * The date when the channel user was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel User updated at must not be empty' })
  @IsDate({ message: 'Channel User updated at must be a date' })
  @Field(() => Date, { description: 'Date the channel user was updated' })
  updatedAt: Date;
}

registerEnumType(UserType, {
 name: 'UserType',
 description: 'The type of the user',
});