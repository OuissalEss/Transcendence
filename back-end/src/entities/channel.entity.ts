// channel.entity.ts
import { Field, ObjectType, ID, registerEnumType} from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsDate, IsOptional, IsEnum, isString } from 'class-validator';


//import {ChannelType} from 'src/enums/channel.enum';

import { ChannelType } from '@prisma/client'; // Import the Prisma-generated Status enum
import { User } from './user.entity';
import { Message } from './message.entity';

@ObjectType()
export class Channel {
  /**
   * The unique identifier of the channel.
   * @type {number}
   */
  @Field(() => ID, {description: 'The unique identifier of the channel.'})
  @IsString({ message: 'Channel ID must be a string' })
  @IsNotEmpty({ message: 'Channel ID cannot be empty' })
  id: String;

  /**
   * The title of the channel.
   * @type {string}
   */
  @Field({ description: 'Channel title' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  /**
   * The password of the channel (nullable).
   * @type {string}
   */
  @Field({ nullable: true, description: 'Channel password' })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  password?: string;

  /**
   * description of the channel. (nullable)
   * @type {string}
   */
  @Field({ nullable: true, description: 'Channel description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  /**
   * profile image of the channel. (nullable)
   * @type {string}
   */
  @Field({ nullable: true, description: 'Channel profile image' })
  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;

  /**
   * The type of the channel.
   * @type {ChannelType}
   */
  @Field(() => ChannelType, {
   defaultValue: "PUBLIC",
   description: 'Channel type'
  })
  @IsEnum(ChannelType, { message: 'Invalid channel type' })
  type: ChannelType;

  /**
   * Users participating in the channel.
   * @type {User[]}
   */
  @Field(() => [User], {
   description: 'Users participating in the channel',
   defaultValue: []
  })
  @IsNotEmpty({ message: 'Users participating in the channel cannot be empty' })
  members?: User[];

  /**
   * Owner of the channel.
   * @type {User}
   */

  @Field(() => User, {
    description: 'Owner of the channel',
    nullable: true
  })  
  @IsOptional()
  owner?: User;

  /**
   * Channel Admins.
   * @type {User[]}
   */

  @Field(() => [User], {
    description: 'Channel Admins',
    defaultValue: []
  })
  @IsNotEmpty({ message: 'Channel Admins cannot be empty' })
  admins?: User[];

  /**
   * banned users from the channel.
   * @type {User[]}
   */

  @Field(() => [User], {
    description: 'banned users from the channel',
    defaultValue: []
  })
  @IsNotEmpty({ message: 'banned users from the channel cannot be empty' })
  banned?: User[];

  /**
   * muted users from the channel.
   */
  @Field(() => [User], {
    description: 'muted users from the channel',
    defaultValue: []
  })
  @IsNotEmpty({ message: 'muted users from the channel cannot be empty' })
  muted?: User[];

  /**
   * messages in the channel.
   * @type {Message[]}
   */
  @Field(() => [Message], {
    description: 'messages in the channel',
    defaultValue: []
  })
  @IsNotEmpty({ message: 'messages in the channel cannot be empty' })
  messages?: Message[];

  /**
   * The date when the channel was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel created at must not be empty' })
  @IsDate({ message: 'Channel created at must be a date' })
  @Field(() => Date, { description: 'Date the channel was created' })
  createdAt: Date;

  /**
   * The date when the channel was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel updated at must not be empty' })
  @IsDate({ message: 'Channel updated at must be a date' })
  @Field(() => Date, { description: 'Date the channel was updated' })
  updatedAt: Date;
}


registerEnumType(ChannelType, {
 name: 'ChannelType',
 description: 'The type of the channel',
});
