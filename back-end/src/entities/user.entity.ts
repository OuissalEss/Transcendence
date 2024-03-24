// user.entity.ts
import { Field, ObjectType, Int, ID, registerEnumType} from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsDate,
  IsNotEmpty,
  IsString
} from 'class-validator';

import { Connection } from './connection.entity';
import { UserAchievement } from './achievements-user.entity';
import { Friend } from 'src/entities/friend.entity';
import { Block } from 'src/entities/block.entity';
import { Match } from 'src/entities/match.entity';
import { ChannelUser } from 'src/entities/channel-user.entity';
import { Notification } from 'src/entities/notification.entity';

import {Avatar} from "./avatar.entity";

import { Status } from '@prisma/client'; // Import the Prisma-generated Status enum
//import { Status } from 'src/enums/status.enum';

@ObjectType()
export class User {
  /**
   * The unique identifier of the user.
   * @type {number}
   */
  @Field(() => ID)
  @IsString({ message: 'ID must be an string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  id: String;

  /**
   * User email address.
   * @type {string}
   */
  @Field({ description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  /**
   * User username.
   * @type {string}
   */
  @Field({ description: 'User username' })
  @IsString({ message: 'Username must be an string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  /**
   * User first name.
   * @type {string}
   */
  @Field({ description: 'User first name' })
  @IsString({ message: 'FirstName must be an string' })
  @IsNotEmpty({ message: 'FirstName cannot be empty' })
  firstName: string;

  /**
   * User last name.
   * @type {string}
   */
  @Field({ description: 'User last name' })
  @IsString({ message: 'LastName must be an string' })
  @IsNotEmpty({ message: 'LastName cannot be empty' })
  lastName: string;

  /**
   * The associated avatar entity.
   * @type {Avatar}
   */
  @Field({
    nullable: true,
    description: 'The associated avatar entity'
  })
  @IsNotEmpty({ message: 'Avatar URL cannot be empty' })
  avatar?: Avatar;

  /**
   * User experience points (nullable).
   * @type {number}
   */
  @Field(() => Int, { description: 'User experience points', nullable: true })
  @IsInt({ message: 'XP must be an integer' })
  @IsNotEmpty({ message: 'XP cannot be empty' })
  xp: number;

  /**
   * User status (nullable).
   * @type {Status}
   */
  @Field(() => Status, {
    defaultValue: "Offline",
    description: 'User status'
  })
  @IsNotEmpty({ message: 'Status must not be empty' })
  status: Status;

  /**
   * The associated connection entity.
   * @type {Connection}
   */
  @IsNotEmpty({ message: 'Connection must not be empty' })
  @Field(() => Connection, {
    description: 'User connection',
    nullable: true,
  })
  connection?: Connection;

  /**
   * User achievements.
   * @type {UserAchievement[]}
   */
  @Field(() => [UserAchievement], {
    description: 'User achievements',
    defaultValue: [],
  })
  achievements?: UserAchievement[];

  /**
   * User sent friend requests.
   * @type {Friend[]}
   */
  @IsNotEmpty({ message: 'User sent friend requests must not be empty' })
  @Field(() => [Friend], {
    description: 'User sent friend requests',
    defaultValue: []
  })
  send?: Friend[];

  /**
   * User received friend requests.
   * @type {Friend[]}
   */
  @IsNotEmpty({ message: 'User received friend requests must not be empty' })
  @Field(() => [Friend], {
    description: 'User received friend requests',
    defaultValue: []
  })
  receive?: Friend[];

  /**
   * User blocked users.
   * @type {Block[]}
   */
  @IsNotEmpty({ message: 'User blocked users must not be empty' })
  @Field(() => [Block], {
    description: 'User blocked users',
    defaultValue: [],
  })
  blocking?: Block[];

  /**
   * Users who blocked the user.
   * @type {Block[]}
   */
  @IsNotEmpty({ message: 'User who blocked the user must not be empty' })
  @Field(() => [Block], {
    description: 'Users who blocked the user',
    defaultValue: [],
  })
  blocked?: Block[];

  /**
   * Matches where the user is the host (nullable).
   * @type {Match[]}
   */
  @IsNotEmpty({ message: 'Matches must not be empty' })
  @Field(() => [Match], {
    description: 'Matches where the user is the host',
    defaultValue: [],
  })
  host?: Match[];

  /**
   * avatar test file
   * @type {String}
   */
  @Field(() => String, {
    description: 'avatar test file',
    nullable: true,
  })
  avatarTest?: string;

  /**
   * Matches where the user is the guest (nullable).
   * @type {Match[]}
   */
  @IsNotEmpty({ message: 'Matches must not be empty' })
  @Field(() => [Match], {
    description: 'Matches where the user is the guest',
    defaultValue: []
  })
  guest?: Match[];

  /**
   * Matches where the user is the winner (nullable).
   * @type {Match[]}
   */
  @IsNotEmpty({ message: 'Matches must not be empty' })
  @Field(() => [Match], {
    description: 'Matches where the user is the winner',
    defaultValue: [],
  })
  winner?: Match[];

  /**
   * User's channel participation (nullable).
   * @type {ChannelUser[]}
   */
  @IsNotEmpty({ message: "User's channel must not be empty"})
  @Field(() => [ChannelUser], {
    description: "User's channel participation",
    defaultValue: [],
  })
  user?: ChannelUser[];

  /**
   * User sent notifications.
   * @type {Notification[]}
   */
  @Field(() => [Notification], {
    description: 'User sent notifications',
    defaultValue: [],
  })
  sender?: Notification[];

  /**
   * User received notifications.
   * @type {Notification[]}
   */
  @Field(() => [Notification], {
    description: 'User received notifications',
    defaultValue: [],
  })
  receiver?: Notification[];

  /**
   * The date the user account was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'User created at must not be empty' })
  @IsDate({ message: 'User created at must be a date' })
  @Field(() => Date, {
    description: 'Date the user was created'
  })
  createdAt: Date;

  /**
   * The date the user account was last updated.
   * @type {Date}
   */
  @IsDate({ message: 'User updated at must be a date' })
  @Field(() => Date, {
    description: 'Date the user was last updated'
  })
  updatedAt: Date;
}


// Register the PrismaStatus enum with GraphQL
registerEnumType(Status, {
  name: 'Status',
  description: 'The type of the user status.',
});