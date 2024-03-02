// friend.entity.ts
import {Field, InputType} from '@nestjs/graphql';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';


@InputType()
export class CreateFriendInput {
    /**
   * The user who sent the friend request.
   * @type {User}
   */
  @Field(() => String, { description: 'User who sent the friend request' })
  @IsString({ message: 'Sender ID must be an integer' })
  @IsNotEmpty({ message: 'Sender ID cannot be empty' })
  senderId: string;

    /**
   * The user who sent the friend request.
   * @type {User}
   */
  @Field(() => String, { description: 'User who receive the friend request' })
  @IsString({ message: 'Receiver ID must be an integer' })
  @IsNotEmpty({ message: 'Receiver ID cannot be empty' })
  receiverId: string;


    /**
   * The friend request acceptance status.
   * @type {boolean}
   */
  @Field(() => Boolean, {
      defaultValue: false,
      description: 'Friend request acceptance status'
  })
  @IsBoolean({ message: 'Is accepted must be a boolean' })
  @IsNotEmpty({ message: 'Is accepted cannot be empty' })
  isAccepted: boolean;
}
