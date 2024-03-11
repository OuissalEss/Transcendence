import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateUserTestInput {
  /**
   * User username.
   * @type {string}
   */
  @Field({ description: 'User username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;

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
   * User first name.
   * @type {string}
   */
  @Field({ description: 'User first name' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  /**
   * password of the user.
   * @type {string}
   */
  @Field({ description: 'password of the user' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  /**
   * User last name.
   * @type {string}
   */
  @Field({ description: 'User last name' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;
    /**
   * The default filename of the avatar.
   * @type {string}
   */
    @IsNotEmpty({ message: 'Default filename must not be empty' })
    @Field(() => String, { description: 'Default filename of the avatar' })
    avatar: string;
  
}
