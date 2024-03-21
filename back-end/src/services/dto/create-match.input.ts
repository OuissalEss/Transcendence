import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateMatchInput {

  /**
   * host score.
   * @type {number}
   */
  @Field({ description: 'Host score' })
  @IsNotEmpty({ message: 'Host score cannot be empty' })
  @IsInt({ message: 'Host score must be an integer' })
  host_score_m: number;

  /**
   * guest score.
   * @type {number}
   */
  @Field({ description: 'Guest score' })
  @IsNotEmpty({ message: 'Guest score cannot be empty' })
  @IsInt({ message: 'Guest score must be an integer' })
  guest_score_m: number;

  /**
   * The host ID of the user.
   * @type {string}
   */
  @IsNotEmpty({ message: "User host ID must not be empty" })
  @IsString({ message: "User host ID must be a string" })
  @Field(() => String, {
   description: "Host ID of the user",
  })
  hostId: string

  /**
   * The guest ID of the user.
   * @type {string}
   */
  @IsNotEmpty({ message: "User guest ID must not be empty" })
  @IsString({ message: "User guest ID must be a string" })
  @Field(() => String, {
   description: "Guest ID of the user",
  })
  guestId: string;
}
