import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
 IsNotEmpty,
 IsDate,
 IsBoolean,
 IsInt,
 IsString
} from "class-validator";

import { User } from "./user.entity";

/**
* Represents a connection entity that stores user-related data.
*
* @export
* @class Connection
*/
@ObjectType()
export class Connection {
 /**
   * The unique identifier of the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: "Connection ID must not be empty" })
  @IsString({ message: 'Connection ID must be an integer' })
  @Field(() => String, { description: "Unique identifier of the connection" })
  id: string;

 /**
   * The ID of the associated user.
   * @type {string}
   */
  @IsNotEmpty({ message: "User ID must not be empty" })
  @IsString({ message: 'User ID must be an integer' })
  @Field(() => String, { description: "The ID of the associated user" })
  userId: string;

 /**
   * The provider of the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: "Provider must not be empty" })
  @IsString({ message: 'Provider must be an integer' })
  @Field(() => String, { description: "Provider of the connection" })
  provider: string;

 /**
   * The ID from the provider of the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: "Provider ID must not be empty" })
  @IsString({ message: 'Provider ID String must be an integer' })
  @Field(() => String, { description: "Provider ID of the connection" })
  providerId: string;

 /**
   * One-time password associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'OTP must not be empty' })
  @Field(() => String, {
   description: 'One-time password associated with the connection',
   nullable: true,
  })
  otp?: string;

 /**
   * The date when the one-time password was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'OTP created at must not be empty' })
  @IsDate({ message: 'OTP created at must be a valid date' })
  @Field(() => Date, {
   description: 'The date when the one-time password was created',
   nullable: true,
  })
  otpCreatedAt?: Date;

 /**
   * Indicates whether two-factor authentication is enabled for the connection.
   * @type {boolean}
   * @default false
   */
  @IsNotEmpty({ message: 'Is 2FA enabled must not be empty' })
  @IsBoolean({ message: 'Is 2FA enabled must be a boolean' })
  @Field(() => Boolean, {
   defaultValue: false,
   description:
      'Indicates whether two-factor authentication is enabled for the connection',

  })
  is2faEnabled: boolean;

 /**
   * The date when the connection was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: "Created at must not be empty" })
  @IsDate({ message: "Created at must be a valid date" })
  @Field(() => Date, {
   description: "The date when the connection was created",
  })
  createdAt: Date;

 /**
   * The date when the connection was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: "Updated at must not be empty" })
  @IsDate({ message: "Updated at must be a valid date" })
  @Field(() => Date, {
   description: "The date when the connection was last updated",
  })
  updatedAt: Date;
}
