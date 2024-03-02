import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsInt,
  IsDate,
  IsBoolean,
  IsString
} from 'class-validator';

import { User } from "./user.entity";
import { Achievement } from "./achievement.entity";

@ObjectType()
export class UserAchievement {
  /**
   * The unique identifier of the user achievement.
   * @type {number}
   */
  @Field(() => String)
  @IsString({ message: 'User Achievement ID must be an integer' })
  @IsNotEmpty({ message: 'User Achievement ID cannot be empty' })
  id: String;

  /**
   * The user associated with this achievement.
   * @type {User}
   */
  @Field(() => User, {
    description: 'User associated with this achievement'
  })
  userId: User;

  /**
   * The unique identifier of the associated achievement.
   * @type {number}
   */
  @Field(() => String)
  @IsString({ message: 'Achievement ID must be an integer' })
  @IsNotEmpty({ message: 'Achievement ID cannot be empty' })
  achievementId: String;

  /**
   * Indicates whether the user achievement is achieved or not.
   * @type {boolean}
   */
  @IsNotEmpty({message: 'User achievement is achieved must not be empty'})
  @IsBoolean({ message: 'User achievement is achieved must be a boolean'})
  @Field(() => Boolean, {
    defaultValue: false,
    description: 'Whether the user achievement is achieved',
  })
  isAchieved: boolean;

  /**
   * The date when the user achievement was achieved.
   * @type {Date}
   */
  @IsDate({ message: 'User achievement achieved at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was achieved',
    nullable: true,
  })
  achievedAt?: Date;

  /**
   * The date when the user achievement was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'User achievement created at must not be empty' })
  @IsDate({ message: 'User achievement created at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was created',
  })
  createdAt: Date;

  /**
   * The date when the user achievement was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'User achievement updated at must not be empty' })
  @IsDate({ message: 'User achievement updated at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was updated',
  })
  updatedAt: Date;
}