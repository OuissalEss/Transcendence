import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  /**
   * User username.
   * @type {string}
   */
  @Field({ description: 'User username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  /**
   * User first name.
   * @type {string}
   */
  @Field({ description: 'User first name' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  /**
   * User last name.
   * @type {string}
   */
  @Field({ description: 'User last name' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  /**
   * User email address.
   * @type {string}
   */
  @Field({ description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  /**
   * User experience points (nullable).
   * @type {number}
   */
  @Field(() => Int, { description: 'User experience points', nullable: true })
  @IsInt({ message: 'XP must be an integer' })
  xp: number;

  /**
   * Provider of the user.
   * @type {string}
   */
  @Field({ description: 'Provider of the user' })
  @IsNotEmpty({ message: 'Provider cannot be empty' })
  @IsString({ message: 'Provider must be a string' })
  provider: string;
  
  /**
   * The default filename of the avatar.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Default filename must not be empty' })
  @Field(() => String, { description: 'Default filename of the avatar' })
  defaultFilename: string;

  /**
   * The filename of the avatar.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Filename must not be empty' })
  @Field(() => String, { description: 'Filename of the avatar' })
  filename: string;
  
  /**
   * The provider ID of the user.
   * @type {string}
   */
  @IsNotEmpty({ message: "User provider ID must not be empty" })
  @IsString({ message: "User provider ID must be a string" })
  @Field(() => String, {
   description: "Provider ID of the user",
  })
  providerId: string;
}
