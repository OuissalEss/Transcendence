import { InputType, Field, Int } from '@nestjs/graphql';
import {IsNotEmpty, IsEmail, IsInt, IsString, IsEnum, IsOptional} from 'class-validator';


import { Status } from '@prisma/client'; // Import the Prisma-generated Status enum


@InputType()
export class UpdateUserInput {

    
    /**
   * User username.
   * @type {string}
   */
  @Field({ description: 'User username' })
  @IsOptional()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username?: string;

    /**
   * User first name.
   * @type {string}
   */
  @Field({ description: 'User first name' })
  @IsOptional()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

    /**
   * User last name.
   * @type {string}
   */
  @Field({ description: 'User last name' })
  @IsOptional()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

    /**
   * User email address.
   * @type {string}
   */
  @Field({ description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsString({ message: 'Email must be a string' })
  email?: string;

    /**
   * User experience points (nullable).
   * @type {number}
   */
  @Field(() => Int, { description: 'User experience points', nullable: true })
  @IsOptional()
  @IsInt({ message: 'XP must be an integer' })
  xp?: number;

  /**
  * The User Status.
  * @type {string}
  */
  @IsNotEmpty({ message: 'Status must not be empty' })
  @IsOptional()
  @Field(() => String, { description: 'Status of the user' })
  @IsEnum(Status, {message: 'Invalid status'})
  status?: Status;
}
