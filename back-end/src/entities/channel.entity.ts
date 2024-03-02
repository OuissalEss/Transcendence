// channel.entity.ts
import { Field, ObjectType, ID, registerEnumType} from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsDate, IsOptional, IsEnum } from 'class-validator';
import { ChannelUser } from './channel-user.entity';


//import {ChannelType} from 'src/enums/channel.enum';

import { ChannelType } from '@prisma/client'; // Import the Prisma-generated Status enum

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
   * @type {ChannelUser[]}
   */
  @Field(() => [ChannelUser], {
   description: 'Users participating in the channel',
   defaultValue: []
  })
  @IsNotEmpty({ message: 'Users participating in the channel cannot be empty' })
  channel?: ChannelUser[];

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
