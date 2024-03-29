// block.entity.ts
import { Field, ObjectType, ID } from '@nestjs/graphql';
import {IsDate, IsInt, IsNotEmpty, IsString} from 'class-validator';

import { User } from "./user.entity";

@ObjectType()
export class Block {
  /**
   * The unique identifier of the block relationship.
   * @type {number}
   */
  @Field(() => ID, {description: "The unique identifier of the block relationship."})
  @IsString({ message: 'Block ID must be a string' })
  @IsNotEmpty({ message: 'Block ID cannot be empty' })
  id: String;

  /**
   * The user who initiated the block.
   * @type {User}
   */
  @Field(() => String, { description: 'User who blocked another user' })
  @IsString({ message: 'Blocker ID must be a string' })
  @IsNotEmpty({ message: 'Blocker ID cannot be empty' })
  blockerId: String;

  /**
   * The user who is blocked.
   * @type {User}
   */
  @Field(() => String, { description: 'User who is blocked' })
  @IsString({ message: 'Blocked User ID must be a string' })
  @IsNotEmpty({ message: 'Blocker User ID cannot be empty' })
  blockedUserId: String;

  /**
   * The date when the block relationship was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Block relationship date must not be empty' })
  @IsDate({ message: 'Block relationship created at must be a date' })
  @Field(() => Date, {
   description: 'Date the block relationship was created'
  })
  createdAt: Date;

  /**
   * The date when the block relationship was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Block relationship date must not be empty' })
  @IsDate({ message: 'Block relationship updated at must be a date' })
  @Field(() => Date, {
   description: 'Date the block relationship was updated'
  })
  updatedAt: Date;
}