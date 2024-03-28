import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsInt,
  IsDate,
  IsBoolean,
  IsString
} from 'class-validator';

import { User } from "./user.entity";
import { Achievement } from '@prisma/client';

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
  @Field(() => String, {
    description: 'User associated with this achievement'
  })
  userId: String;

  /**
   * User Achievement (nullable).
   * @type {Achievement}
   */
  @Field(() => Achievement, {
    defaultValue: Achievement.welcome,
    description: 'User character'
  })
  @IsNotEmpty({ message: 'Achievement must not be empty' })
  achievement?: Achievement;

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

// Register the PrismaStatus enum with GraphQL
registerEnumType(Achievement, {
  name: 'Achievement',
  description: 'The type of the user-achievement Achievements.',
});
