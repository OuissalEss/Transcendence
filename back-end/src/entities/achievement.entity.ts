// achievement.entity.ts
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, IsDate } from 'class-validator';

import { UserAchievement } from "./achievements-user.entity";

@ObjectType()
export class Achievement {
  /**
   * The unique identifier of the achievement.
   * @type {number}
   */
  @Field(() => String)
  @IsString({ message: 'Achievement String must be an integer' })
  @IsNotEmpty({ message: 'Achievement ID cannot be empty' })
  id: String;

  /**
   * The title of the achievement.
   * @type {string}
   */
  @Field({ description: 'Achievement title' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  /**
   * The description of the achievement.
   * @type {string}
   */
  @Field({ description: 'Achievement description' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  /**
   * The experience points associated with the achievement.
   * @type {number}
   */
  @Field(() => Int, { description: 'Achievement experience points' })
  @IsNotEmpty({ message: 'XP cannot be empty' })
  @IsInt({ message: 'XP must be an integer' })
  xp: number;

  /**
   * The associated user achievement entities.
   * @type {UserAchievement[]}
   */
  @Field(() => [UserAchievement], {
    description: 'The associated user achievement entities',
    nullable: true,
  })
  @IsNotEmpty({ message: 'The associated user achievement cannot be empty' })
  userachievement?: UserAchievement[];

  /**
   * The date when the achievement was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Achievement created at must not be empty' })
  @IsDate({ message: 'Achievement created at must be a date' })
  @Field(() => Date, { description: 'Date the achievement was created' })
  createdAt: Date;

  /**
   * The date when the achievement was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Achievement updated at must not be empty' })
  @IsDate({ message: 'Achievement updated at must be a date' })
  @Field(() => Date, { description: 'Date the achievement was updated' })
  updatedAt: Date;
}