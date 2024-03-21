// match.entity.ts
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { IsInt, IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from "./user.entity";

@ObjectType()
export class Match {
  /**
   * The unique identifier of the match.
   * @type {number}
   */
  @Field(() => String)
  @IsString({ message: 'Match ID must be a string' })
  @IsNotEmpty({ message: 'Match ID cannot be empty' })
  id: String;

  /**
   * The score of the host in the match.
   * @type {number}
   */
  @Field(() => Int, { description: 'Score of the host in the match' })
  @IsInt({ message: 'Host score must be an integer' })
  @IsNotEmpty({ message: 'Host score cannot be empty' })
  host_score_m: number;

  /**
   * The score of the guest in the match.
   * @type {number}
   */
  @Field(() => Int, { description: 'Score of the guest in the match' })
  @IsInt({ message: 'Guest score must be an integer' })
  @IsNotEmpty({ message: 'Guest score cannot be empty' })
  guest_score_m: number;

  /**
   * The start time of the match.
   * @type {Date}
   */
  @Field(() => Date, { description: 'Start time of the match' })
  @IsDate({ message: 'Start time must be a date' })
  @IsNotEmpty({ message: 'Start time cannot be empty' })
  start_m: Date;

  /**
   * The user who hosted the match.
   * @type {string}
   */
  @Field(() => String, { description: 'User who hosted the match' })
  @IsNotEmpty({ message: 'User who hosted the match cannot be empty' })
  @IsString({ message: 'User who hosted the match must be a string' })
  hostId: string;

  /**
   * The user who participated as a guest in the match.
   * @type {string}
   */
  @Field(() => String, { description: 'User who participated as a guest in the match' })
  @IsNotEmpty({ message: 'User who participated as a guest the match cannot be empty' })
  @IsString({ message: 'User who participated as a guest the match must be a string' })
  guestId: string;

  /**
   * The user who won the match (nullable).
   * @type {String}
   */
  @Field(() => String, { nullable: true, description: 'User who won the match' })
  @IsNotEmpty({ message: 'User who won the match cannot be empty' })
  @IsString({ message: 'User who won the match must be a string' })
  winnerId: string;

  /**
   * The date when the match was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Match created at must not be empty' })
  @IsDate({ message: 'Match created at must be a date' })
  @Field(() => Date, { description: 'Date the match was created' })
  createdAt: Date;

  /**
   * The date when the match was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Match updated at must not be empty' })
  @IsDate({ message: 'Match updated at must be a date' })
  @Field(() => Date, { description: 'Date the match was updated' })
  updatedAt: Date;
}
