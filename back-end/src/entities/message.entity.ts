import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate, isNotEmpty, isString } from 'class-validator';

import {ChannelUser} from "./channel-user.entity";
import { User } from './user.entity';
import { Channel } from './channel.entity';

@ObjectType()
export class Message {
    /**
  *
  */
  @Field(() => ID)
  @IsString({ message: 'Message ID must be a string' })
  @IsNotEmpty({ message: 'Message ID cannot be empty' })
  id: String;

    @Field({ description: 'Content of the message' })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  text: string;

  @Field(() => Date, { description: 'Time the message was sent' })
  @IsDate({ message: 'Time must be a date' })
  time?: Date;

  @Field(() => ChannelUser, { description: 'Channel User who sent the message' })
  channelId: string;

    /**
   * The date when the message was sent.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Message created at must not be empty' })
  @IsDate({ message: 'Message created at must be a date' })
  @Field(() => Date, { description: 'Date the Message was created' })
  createdAt: Date;

    /**
   * The date when the message was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Message updated at must not be empty' })
  @IsDate({ message: 'Message updated at must be a date' })
  @Field(() => Date, { description: 'Date the Message was updated' })
  updatedAt: Date;

  @Field(() => String, { description: 'User who sent the message' })
  @IsNotEmpty({ message: 'Sender cannot be empty' })
  @IsString({ message: 'Sender must be a string' })
  sender?: string;

  @Field(() => String, { description: 'id of the user who sent the message' })
  @IsNotEmpty({ message: 'Sender cannot be empty' })
  @IsString({ message: 'Sender must be a string' })
  senderId?: string;

  @Field(() => Channel, { description: 'Channel where the message belongs' })
  @IsNotEmpty({ message: 'Channel cannot be empty' })
  @IsString({ message: 'Channel must be a string' })
  channel?: Channel;

  @Field({ description: 'Message read status' })
  read: boolean;
}