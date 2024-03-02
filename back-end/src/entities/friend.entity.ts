// friend.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsBoolean, IsNotEmpty, IsDate } from 'class-validator';

@ObjectType()
export class Friend {
  /**
   * The unique identifier of the friend relationship.
   * @type {number}
   */
  @Field(() => String, {description: "The unique identifier of the friend relationship"})
  @IsString({ message: 'Friend ID must be an integer' })
  @IsNotEmpty({ message: 'Friend ID cannot be empty' })
  id: String;

  /**
   * The user who sent the friend request.
   * @type {User}
   */
  @Field(() => String, { description: 'User who sent the friend request' })
  @IsString({ message: 'Sender ID must be an integer' })
  @IsNotEmpty({ message: 'Sender ID cannot be empty' })
  senderId: String;

  /**
   * The user who sent the friend request.
   * @type {User}
   */
  @Field(() => String, { description: 'User who receive the friend request' })
  @IsString({ message: 'Receiver ID must be an integer' })
  @IsNotEmpty({ message: 'Receiver ID cannot be empty' })
  receiverId: String;


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
